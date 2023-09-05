import { type httpResponse, type httpRequest, type Controller, type EmailValidator, type AddAccount } from './protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { validationParamRequest } from '../../helpers/validation-params-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  handle (httpRequest: httpRequest): httpResponse {
    try {
      const missingParam = validationParamRequest(httpRequest.body)
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

      const user = this.addAccount.add({ name, email, password })

      return {
        statusCode: 200,
        body: user
      }
    } catch (error) {
      return serverError()
    }
  }
}
