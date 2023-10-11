import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/protocols'
import { type LogErrorRepository } from '../../data/protocols/log-error-repository'

export class LogControllerDecorator implements Controller {
  constructor (
    public readonly controller: Controller,
    public readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.log(httpResponse.body.stack)
    }

    return httpResponse
  }
}
