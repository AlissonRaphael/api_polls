import { InvalidParamError, MissingParamError, ServerError, UnauthorizedError } from '../../errors'
import { type EmailValidator, type Authentication } from './protocols'
import LoginController from './login'

const httpRequest = {
  body: {
    email: 'any_email@domain.com',
    password: '12345'
  }
}

const makeLoginController = (): any => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise((resolve) => { resolve('any_token') })
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const authenticationStub = new AuthenticationStub()
  return {
    create: () => new LoginController(emailValidatorStub, authenticationStub),
    emailValidatorStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const loginController = makeLoginController().create()
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
    const loginController = makeLoginController().create()
    const httpRequest = {
      body: {
        email: 'any_email@domain.com'
      }
    }
    const httpResponse = await loginController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { create, emailValidatorStub } = makeLoginController()
    const loginController = create()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await loginController.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith('any_email@domain.com')
  })

  test('Should return 400 if invalid email provided', async () => {
    const { create, emailValidatorStub } = makeLoginController()
    const loginController = create()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await loginController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { create, emailValidatorStub } = makeLoginController()
    const loginController = create()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await loginController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call Authentication with correct values', async () => {
    const { create, authenticationStub } = makeLoginController()
    const loginController = create()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await loginController.handle(httpRequest)
    expect(authSpy).toBeCalledWith('any_email@domain.com', '12345')
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { create, authenticationStub } = makeLoginController()
    const loginController = create()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => { resolve(null) }))
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
})
