import { type httpRequest, type httpResponse } from './http'

export interface Controller {
  handle: (httpRequest: httpRequest) => httpResponse
}
