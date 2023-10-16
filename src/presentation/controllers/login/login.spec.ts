import { MissingParamError } from '../../errors'
import LoginController from './login'

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const loginController = new LoginController()
    const httpRequest = {
      body: {
        password: '12345'
      }
    }
    const httpResponse = await loginController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password provided', async () => {
    const loginController = new LoginController()
    const httpRequest = {
      body: {
        email: 'any_email@domain.com'
      }
    }
    const httpResponse = await loginController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
})
