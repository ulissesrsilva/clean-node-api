import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
describe('BCrypt Adapter', () => {
    test('Should calls Bcrypt with correct values ', async () => {
        const sut = new BcryptAdapter(12)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', 12)
    })
})
