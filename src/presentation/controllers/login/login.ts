import { type HttpRequest, type HttpResponse, type Controller, type EmailValidator, type Authentication, type Validation } from './protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { validationParamRequest } from '../../helpers/validation-params-helper'

export default class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly emailValidator: EmailValidator,
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

      const token = await this.authentication.auth(email, password)
      if (!token) {
        return unauthorized()
      }

      return ok({ token })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
