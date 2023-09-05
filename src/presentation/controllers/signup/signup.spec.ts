import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { type EmailValidator, type AddAccount } from './protocols'

const signUpController = (): any => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  class AddAccountStub implements AddAccount {
    add (account: any): any {
      return {
        id: 'valid_uuid',
        name: 'valid_name',
        email: 'valid_email@test.com'
      }
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const addAccountStub = new AddAccountStub()
  return {
    create: () => new SignUpController(emailValidatorStub, addAccountStub),
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name provided', () => {
    const signUpControllerTest = signUpController().create()
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
    const signUpControllerTest = signUpController().create()
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
    const signUpControllerTest = signUpController().create()
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

  test('Should return 400 if no password confirmation provided', () => {
    const signUpControllerTest = signUpController().create()
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

  test('Should return 400 if no confirmation fails', () => {
    const signUpControllerTest = signUpController().create()
    const httpRequest = {
      body: {
        name: 'Bob',
        email: 'email@test.com',
        password: '12345',
        passwordConfirmation: '54321'
      }
    }
    const response = signUpControllerTest.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should call EmailValidator with email', () => {
    const { create, emailValidatorStub } = signUpController()
    const signUpControllerTest = create()
    const validatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'Bob',
        email: 'valid_email@test.com',
        password: '12345',
        passwordConfirmation: '12345'
      }
    }
    const response = signUpControllerTest.handle(httpRequest)
    expect(response.statusCode).toBe(200)
    expect(validatorSpy).toHaveBeenCalledWith('valid_email@test.com')
  })

  test('Should return 400 if an invalid email provided', () => {
    const { create, emailValidatorStub } = signUpController()
    const signUpControllerTest = create()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)
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

  test('Should return 500 if EmailValidator throws', () => {
    const { create, emailValidatorStub } = signUpController()
    const signUpControllerTest = create()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = {
      body: {
        name: 'Bob',
        email: 'any_email@test.com',
        password: '12345',
        passwordConfirmation: '12345'
      }
    }
    const response = signUpControllerTest.handle(httpRequest)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })

  test('Should call AddAccount with correct values', () => {
    const { create, addAccountStub } = signUpController()
    const signUpControllerTest = create()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@test.com',
        password: '12345',
        passwordConfirmation: '12345'
      }
    }
    const response = signUpControllerTest.handle(httpRequest)
    expect(response.statusCode).toBe(200)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@test.com',
      password: '12345'
    })
  })

  test('Should return 500 if AddAccount throws', () => {
    const { create, addAccountStub } = signUpController()
    const signUpControllerTest = create()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@test.com',
        password: '12345',
        passwordConfirmation: '12345'
      }
    }
    const response = signUpControllerTest.handle(httpRequest)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })

  test('Should return 200 if valid data provided', () => {
    const signUpControllerTest = signUpController().create()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@test.com',
        password: '12345',
        passwordConfirmation: '12345'
      }
    }
    const response = signUpControllerTest.handle(httpRequest)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id: 'valid_uuid',
      name: 'valid_name',
      email: 'valid_email@test.com'
    })
  })
})
