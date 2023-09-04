import { type httpResponse, type httpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { type Controller } from '../protocols/controller'
import { type EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'
import { validationParamRequest } from '../helpers/validation-params-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  handle (httpRequest: httpRequest): httpResponse {
    const missingParam = validationParamRequest(httpRequest.body)
    if (missingParam) {
      return badRequest(new MissingParamError(missingParam))
    }

    const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!emailIsValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return {
      statusCode: 200,
      body: {}
    }
  }
}
