import { EmailValidatorAdapter } from './email-validator'
describe('EmailValidator Adapter', () => {
    test('Should return false if validator returns false', () => {
        const sut: EmailValidatorAdapter = new EmailValidatorAdapter()
        const isValid: boolean = sut.isValid('invalid_email@mail.com')
        expect(isValid).toBe(false)
    })
})
