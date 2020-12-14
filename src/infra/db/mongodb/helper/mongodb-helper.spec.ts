import { MongoHelper as sut } from './mongodb-helper'

describe('Mongo Helper', () => {
    beforeAll(async () => {
        await sut.connect(process.env.MONGO_URL as string)
    })

    afterAll(async () => {
        await sut.disconnect()
    })
  test('Should reconnect if mongodb is not accessible', async () => {
     let account = sut.getCollection('accounts')
     expect(account).toBeTruthy()
     await sut.disconnect()
     account = sut.getCollection('accounts')
     expect(account).toBeTruthy()
  })
})
