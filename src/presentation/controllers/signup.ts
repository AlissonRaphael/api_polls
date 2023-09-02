import { type httpResponse, type httpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
    const { name, email } = httpRequest.body

    if (!name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!email) {
      return badRequest(new MissingParamError('email'))
    }

    return {
      statusCode: 200,
      body: {}
    }
  }
}
