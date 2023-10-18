import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { validationParamRequest } from '../../helpers/validation-params-helper'
import { type HttpRequest, type HttpResponse, type Controller } from '../../protocols'
import { type EmailValidator } from '../signup/protocols'
import { type Authentication } from '../../../domain/usecases/authentication'

export default class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParam = validationParamRequest(httpRequest.body, ['email', 'password'])
      if (missingParam) {
        return badRequest(new MissingParamError(missingParam))
      }

      const { email, password } = httpRequest.body
      const emailIsValid = this.emailValidator.isValid(email)
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authentication.auth(email, password)
      return { statusCode: 200, body: {} }
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
