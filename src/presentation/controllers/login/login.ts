import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { validationParamRequest } from '../../helpers/validation-params-helper'
import { type HttpRequest, type HttpResponse, type Controller } from '../../protocols'

export default class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const missingParam = validationParamRequest(httpRequest.body, ['email', 'password'])
    if (missingParam) {
      return badRequest(new MissingParamError(missingParam))
    }

    return await new Promise(resolve => { resolve({ statusCode: 200, body: {} }) })
  }
}
