import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { type EmailValidator, type AddAccount, type Validation } from './protocols'

const httpRequest = {
  body: {
    name: 'valid_name',
    email: 'valid_email@test.com',
    password: '12345',
    passwordConfirmation: '12345'
  }
}

const makeSignUpController = (): any => {
  class ValidationStub implements Validation {
    validate(params: string[]): Error | null {
      return null
    }
  }

  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  class AddAccountStub implements AddAccount {
    add (account: any): any {
      return new Promise(resolve => {
        resolve({
          id: 'valid_uuid',
          name: 'valid_name',
          email: 'valid_email@test.com'
        })
      })
    }
  }

  const validationStub = new ValidationStub()
  const emailValidatorStub = new EmailValidatorStub()
  const addAccountStub = new AddAccountStub()
  return {
    create: () => new SignUpController(validationStub, emailValidatorStub, addAccountStub),
    validationStub,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { create, validationStub } = makeSignUpController()
    const signUpController = create()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpResponse = await signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return 400 if Validation return an error', async () => {
    const { create, validationStub } = makeSignUpController()
    const signUpController = create()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('any_field'))
  })

  test('Should call EmailValidator with email', async () => {
    const { create, emailValidatorStub } = makeSignUpController()
    const signUpController = create()
    const validatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpResponse = await signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(validatorSpy).toHaveBeenCalledWith('valid_email@test.com')
  })

  test('Should return 400 if an invalid email provided', async () => {
    const { create, emailValidatorStub } = makeSignUpController()
    const signUpController = create()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)
    const httpRequest = {
      body: {
        name: 'Bob',
        email: 'invalid_email@test.com',
        password: '12345',
        passwordConfirmation: '12345'
      }
    }
    const httpResponse = await signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { create, emailValidatorStub } = makeSignUpController()
    const signUpController = create()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = {
      body: {
        name: 'Bob',
        email: 'any_email@test.com',
        password: '12345',
        passwordConfirmation: '12345'
      }
    }
    const httpResponse = await signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAccount with correct values', async () => {
    const { create, addAccountStub } = makeSignUpController()
    const signUpController = create()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@test.com',
        password: '12345',
        passwordConfirmation: '12345'
      }
    }
    const httpResponse = await signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@test.com',
      password: '12345'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { create, addAccountStub } = makeSignUpController()
    const signUpController = create()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@test.com',
        password: '12345',
        passwordConfirmation: '12345'
      }
    }
    const httpResponse = await signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 if valid data provided', async () => {
    const signUpController = makeSignUpController().create()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@test.com',
        password: '12345',
        passwordConfirmation: '12345'
      }
    }
    const httpResponse = await signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_uuid',
      name: 'valid_name',
      email: 'valid_email@test.com'
    })
  })
})
