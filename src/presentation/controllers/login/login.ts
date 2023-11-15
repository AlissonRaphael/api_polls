import { type HttpRequest, type HttpResponse, type Controller, type EmailValidator, type Authentication, type Validation } from './protocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'

export default class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const paramError = this.validation.validate(httpRequest.body)
      if (paramError) {
        return badRequest(paramError)
      }
      const { email, password } = httpRequest.body
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
