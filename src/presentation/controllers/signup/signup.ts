
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, EmailValidator, AddAcount } from './signup-protocols'

export class SignUpController implements Controller {
    private readonly emailValidor: EmailValidator
    private readonly addAcount: AddAcount

    constructor (emailValidator: EmailValidator, addAcount: AddAcount) {
        this.emailValidor = emailValidator
        this.addAcount = addAcount
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            // parametros obrigatorios
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) { return badRequest(new MissingParamError(field)) }
            }

            const { name, email, password, passwordConfirmation } = httpRequest.body

            if (password !== passwordConfirmation) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }

            // verificar se o email é valido
            const isValid: boolean = this.emailValidor.isValid(email)
            if (!isValid) return badRequest(new InvalidParamError('email'))

            const account = await this.addAcount.add({ name, email, password })

            return ok(account)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
