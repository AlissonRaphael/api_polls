import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { validationParamRequest } from '../../helpers/validation-params-helper'
import { type HttpRequest, type HttpResponse, type Controller } from '../../protocols'
import { type EmailValidator } from '../signup/protocols'

export default class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParam = validationParamRequest(httpRequest.body, ['email', 'password'])
      if (missingParam) {
        return badRequest(new MissingParamError(missingParam))
      }

      const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return await new Promise(resolve => { resolve({ statusCode: 200, body: {} }) })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
