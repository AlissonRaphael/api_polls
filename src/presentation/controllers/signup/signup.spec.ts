import { SignUpController } from './signup'
import { MissingParamError, ServerError } from '../../errors'
import { type AddAccount, type Validation } from './protocols'

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
  const addAccountStub = new AddAccountStub()
  return {
    create: () => new SignUpController(validationStub, addAccountStub),
    validationStub,
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
