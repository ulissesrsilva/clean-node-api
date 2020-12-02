import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AddAcount, AddAcountModel, AccountModel } from './signup-protocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAcountStub: AddAcount
}

// padrão factory
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    // stub só se preocupa com o retorno, como ele chega lá não é responsabilidade, serve para testar comportamento
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAcount = (): AddAcount => {
  class AddAcountStub implements AddAcount {
    // stub só se preocupa com o retorno, como ele chega lá não é responsabilidade, serve para testar comportamento
    async add (account: AddAcountModel): Promise<AccountModel> {
      const fakeAccount = {
        _id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAcountStub()
}

const makeSut = (): SutTypes => {
  const addAcountStub = makeAddAcount()
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub, addAcountStub)
  return { sut, emailValidatorStub, addAcountStub }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        // name: "nome",
        email: 'teste@test.com.br',
        password: 'pass',
        passwordConfirmation: 'pass'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'nome',
        // email: "teste@test.com.br",
        password: 'pass',
        passwordConfirmation: 'pass'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password confirmation  is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'nome',
        email: 'teste@test.com.br',
        // password: 'pass',
        passwordConfirmation: 'pass'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if password confirmation fails', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'nome',
          email: 'teste@test.com.br',
          password: 'password',
          passwordConfirmation: 'invalid_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'nome',
        email: 'teste@test.com.br',
        password: 'pass'
        // passwordConfirmation: 'pass'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    // spyOn serve para alterar propriedades e comportamentos, mas também para capturar o comportamento intern da funcao
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'nome',
        email: 'testetest.com.br',
        password: 'pass',
        passwordConfirmation: 'pass'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Shoud call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    // spyOn serve para alterar propriedades e comportamentos, mas também para capturar o comportamento intern da funcao
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'nome',
        email: 'testetest.com.br',
        password: 'pass',
        passwordConfirmation: 'pass'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('testetest.com.br')
  })

  test('Should return 500 if EmailValidator throws error', async () => {
      const { emailValidatorStub, sut } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
      const httpRequest = {
        body: {
          name: 'nome',
          email: 'testetest.com.br',
          password: 'pass',
          passwordConfirmation: 'pass'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAcountStub } = makeSut()
    // spyOn serve para alterar propriedades e comportamentos, mas também para capturar o comportamento intern da funcao
    const addSpy = jest.spyOn(addAcountStub, 'add')
    const httpRequest = {
      body: {
        name: 'nome',
        email: 'testetest.com.br',
        password: 'pass',
        passwordConfirmation: 'pass'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'nome',
        email: 'testetest.com.br',
        password: 'pass'
    })
  })

  test('Should return 500 if AddAcount throws error', async () => {
      const { addAcountStub, sut } = makeSut()
      jest.spyOn(addAcountStub, 'add').mockImplementationOnce(async () => { return await new Promise((resolve, reject) => { reject(new Error()) }) })
      const httpRequest = {
        body: {
          name: 'nome',
          email: 'testetest.com.br',
          password: 'pass',
          passwordConfirmation: 'pass'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 if a valid account is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        _id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      _id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })
})
