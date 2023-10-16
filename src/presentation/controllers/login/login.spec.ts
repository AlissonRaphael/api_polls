import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { type EmailValidator } from '../signup/protocols'
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

  const emailValidatorStub = new EmailValidatorStub()
  return {
    create: () => new LoginController(emailValidatorStub),
    emailValidatorStub
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
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)
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
})
