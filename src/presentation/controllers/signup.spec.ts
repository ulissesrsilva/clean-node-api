import { SignUpController } from './signup'
import { EmailValidator } from '../protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    // stub só se preocupa com o retorno, como ele chega lá não é responsabilidade, serve para testar comportamento
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub)
  return { sut, emailValidatorStub }
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

  test('Should return 400 if an invalid is provided', async () => {
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
})
