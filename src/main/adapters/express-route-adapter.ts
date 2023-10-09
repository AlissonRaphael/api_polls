import { type Request, type Response } from 'express'
import { type HttpResponse, type Controller, type HttpRequest } from '../../presentation/protocols'

export function AdaptRoute (controller: Controller) {
  return async (request: Request, response: Response): Promise<void> => {
    const httpRequest: HttpRequest = { body: request.body }
    const httpResponse: HttpResponse = await controller.handle(httpRequest)
    response.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
