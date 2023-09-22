import express from 'express'
import configMiddlewares from './middlewares'

const app = express()

configMiddlewares(app)

export { app }
