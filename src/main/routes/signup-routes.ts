import { type Router } from 'express'
import { AdaptRoute } from '../adapters/express-route-adapter'
import { MakeSignUpController } from '../factories/signup/signup'

export default (router: Router): void => {
  router.post('/signup', AdaptRoute(MakeSignUpController()))
}
