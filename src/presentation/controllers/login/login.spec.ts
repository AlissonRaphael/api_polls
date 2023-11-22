import { MissingParamError, UnauthorizedError, ServerError } from '../../errors'
import { type Authentication, type Validation } from './protocols'
import LoginController from './login'

const httpRequest = {
  body: {
    email: 'any_email@domain.com',
    password: '12345'
  }
}

const makeLoginController = (): any => {
  class ValidationStub implements Validation {
    validate (params: string[]): Error | null {
      return null
    }
  }

  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise((resolve) => { resolve('any_token') })
    }
  }

  const validationStub = new ValidationStub()
  const authenticationStub = new AuthenticationStub()
  return {
    create: () => new LoginController(validationStub, authenticationStub),
    authenticationStub,
    validationStub
  }
}

describe('Login Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { create, validationStub } = makeLoginController()
    const signUpController = create()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpResponse = await signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation return an error', async () => {
    const { create, validationStub } = makeLoginController()
    const signUpController = create()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('any_field'))
  })

  test('Should call Authentication with correct values', async () => {
    const { create, authenticationStub } = makeLoginController()
    const loginController = create()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await loginController.handle(httpRequest)
    expect(authSpy).toBeCalledWith('any_email@domain.com', '12345')
  })

  test('Should return 401 if Authentication is invalid', async () => {
    const { create, authenticationStub } = makeLoginController()
    const loginController = create()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null)
    const httpResponse = await loginController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { create, authenticationStub } = makeLoginController()
    const loginController = create()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await loginController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 if valid credetials are provided', async () => {
    const { create } = makeLoginController()
    const loginController = create()
    const httpResponse = await loginController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ token: 'any_token' })
  })
})
