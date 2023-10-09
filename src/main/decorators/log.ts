import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (public readonly controller: Controller) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      console.log('erro')
    }

    return httpResponse
  }
}
