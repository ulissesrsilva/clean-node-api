import { AddAcount } from '../../domain/usecases/add-account'
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { EmailValidator, Controller, HttpRequest, HttpResponse } from '../protocols'
export class SignUpController implements Controller {
    private readonly emailValidor: EmailValidator
    private readonly addAcount: AddAcount

    constructor (emailValidator: EmailValidator, addAcount: AddAcount) {
        this.emailValidor = emailValidator
        this.addAcount = addAcount
    }

    handle (httpRequest: HttpRequest): HttpResponse {
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

            this.addAcount.add({ name, email, password })

            return { statusCode: 200, body: {} }
        } catch (error) {
            // console.log(error)
            return serverError()
        }
    }
}
