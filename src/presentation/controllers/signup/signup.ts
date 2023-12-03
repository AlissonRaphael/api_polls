import { type HttpResponse, type HttpRequest, type Controller, type AddAccount, type Validation } from './protocols'
import { badRequest, serverError, ok } from '../../helpers/http/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const user = await this.addAccount.add({ name, email, password })
      return ok(user)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
