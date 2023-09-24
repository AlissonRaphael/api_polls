import express from 'express'
import configMiddlewares from './middlewares'
import configRoutes from './routes'

const app = express()

configMiddlewares(app)
configRoutes(app)

export { app }
