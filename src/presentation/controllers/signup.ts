import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { EmailValidator, Controller, HttpRequest, HttpResponse } from '../protocols'
export class SignUpController implements Controller {
    private readonly emailValidor: EmailValidator

    constructor (emailValidator: EmailValidator) {
        this.emailValidor = emailValidator
    }

    handle (httpRequest: HttpRequest): HttpResponse {
        try {
            // parametros obrigatorios
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) { return badRequest(new MissingParamError(field)) }
            }

            const { email, password, passwordConfirmation } = httpRequest.body

            if (password !== passwordConfirmation) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }

            // verificar se o email é valido
            const isValid: boolean = this.emailValidor.isValid(email)
            if (!isValid) return badRequest(new InvalidParamError('email'))

            return { statusCode: 200, body: {} }
        } catch (error) {
            // console.log(error)
            return serverError()
        }
    }
}
