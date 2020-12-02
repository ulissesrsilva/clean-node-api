import { HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { ServerError } from '../errors/server-error'

export const badRequest = (error: MissingParamError): HttpResponse => ({
      statusCode: 400, body: error
})

export const serverError = (): HttpResponse => ({
      statusCode: 500, body: new ServerError()
})
