import { type Request, type Response } from 'express'
import { type httpResponse, type Controller, type httpRequest } from '../../presentation/protocols'

export function AdaptRoute (controller: Controller) {
  return async (request: Request, response: Response): Promise<void> => {
    const httpRequest: httpRequest = { body: request.body }
    const httpResponse: httpResponse = await controller.handle(httpRequest)
    response.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
