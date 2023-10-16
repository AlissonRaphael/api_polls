import { type HttpResponse, type HttpRequest, type Controller, type EmailValidator, type AddAccount } from './protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helper'
import { validationParamRequest } from '../../helpers/validation-params-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      const missingParam = validationParamRequest(httpRequest.body, requiredFields)
      if (missingParam) {
        return badRequest(new MissingParamError(missingParam))
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const emailIsValid = this.emailValidator.isValid(email)
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const user = await this.addAccount.add({ name, email, password })

      return ok(user)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
