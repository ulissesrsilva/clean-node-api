import { MongoHelper } from '../helper/mongodb-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongodb Repository', () => {
    // sempre antes de fazer os testes de integracão precisa
    // abrir connection com mongo e quando concluir precisa fechar
    beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL as string))

    afterAll(async () => await MongoHelper.disconnect())

    test('should return an account on sucess', async () => {
      const sut = new AccountMongoRepository()
      const account = await sut.add({
          name: 'any_name',
          email: 'email@mail.com',
          password: 'any_password'
      })
      expect(account).toBeTruthy()
      expect(account._id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('email@mail.com')
      expect(account.password).toBe('any_password')
    })
})
