import { Router, type Express } from 'express'
import FastGlob from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  FastGlob.sync('**/src/main/routes/**routes.ts').map(async (path): Promise<void> => {
    (await import(`../../../${path}`)).default(router)
  })
}
