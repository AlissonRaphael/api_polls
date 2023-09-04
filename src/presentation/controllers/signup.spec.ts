import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { type EmailValidator } from '../protocols/email-validator'

const signUpController = (emailValidator?: EmailValidator): SignUpController => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = emailValidator ?? new EmailValidatorStub()
  return new SignUpController(emailValidatorStub)
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name provided', () => {
    const signUpControllerTest = signUpController()
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
    const signUpControllerTest = signUpController()
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

  test('Should return 400 if no password provided', () => {
    const signUpControllerTest = signUpController()
    const httpRequest = {
      body: {
        name: 'Bob',
        email: 'email@test.com',
        passwordConfirmation: '12345'
      }
    }
    const response = signUpControllerTest.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no confirmation provided', () => {
    const signUpControllerTest = signUpController()
    const httpRequest = {
      body: {
        name: 'Bob',
        email: 'email@test.com',
        password: '12345'
      }
    }
    const response = signUpControllerTest.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email provided', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        return false
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const signUpControllerTest = signUpController(emailValidatorStub)
    const httpRequest = {
      body: {
        name: 'Bob',
        email: 'invalid_email@test.com',
        password: '12345',
        passwordConfirmation: '12345'
      }
    }
    const response = signUpControllerTest.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })
})