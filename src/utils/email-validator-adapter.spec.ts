import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

jest.mock('validator', () => ({
   isEmail (): boolean {
       return true
   }
}))

const makeSut = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
    test('Should return false if validator returns false', () => {
        const sut: EmailValidatorAdapter = makeSut()
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const isValid: boolean = sut.isValid('invalid_email@mail.com')
        expect(isValid).toBe(false)
    })

    test('Should return true if validator returns true', () => {
        const sut: EmailValidatorAdapter = makeSut()
        const isValid: boolean = sut.isValid('valid_email@mail.com')
        expect(isValid).toBe(true)
    })

    test('Should call validator with correct email', () => {
        const sut: EmailValidatorAdapter = makeSut()
        const isEmailSpy = jest.spyOn(validator, 'isEmail')
        sut.isValid('any_email@mail.com')
        expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
})
