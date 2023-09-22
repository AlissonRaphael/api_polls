import request from 'supertest'
import { app } from '../config/app'

describe('Body Parse Middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/test-body-parser', (request, response) => {
      response.send(request.body)
    })

    await request(app)
      .post('/test-body-parser')
      .send({ name: 'any_name' })
      .expect({ name: 'any_name' })
  })
})
