import { SignUpController } from './signup'
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
    // sut is system unit test
  })
})
