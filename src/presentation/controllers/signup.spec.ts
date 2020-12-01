import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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

  test('Should return 400 if no password confirmation is provided', async () => {
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
})
