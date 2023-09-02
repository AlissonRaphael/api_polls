import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

describe('SignUp Controller', () => {
  test('Should return 400 if no name provided', () => {
    const signUpControllerTest = new SignUpController()
    const httpRequest = {
      body: {
        email: 'email@test.com',
        password: '12345',
        passwordConfirmation: '12345'
      }
    }
    const response = signUpControllerTest.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email provided', () => {
    const signUpControllerTest = new SignUpController()
    const httpRequest = {
      body: {
        name: 'Bob',
        password: '12345',
        passwordConfirmation: '12345'
      }
    }
    const response = signUpControllerTest.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })
})
