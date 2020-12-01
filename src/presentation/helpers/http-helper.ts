import { HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'

export const badRequest = (error: MissingParamError): HttpResponse => ({
      statusCode: 400, body: error
})
