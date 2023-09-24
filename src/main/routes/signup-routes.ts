import { type Router, type Request, type Response } from 'express'

export default (router: Router): void => {
  router.post('/signup', (request: Request, response: Response) => {
    return response.status(201).json({ status: 'completed' })
  })
}
