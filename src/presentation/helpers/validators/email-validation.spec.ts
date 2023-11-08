import { EmailValidation } from './email-validation'
import { type EmailValidator } from '../../controllers/signup/protocols'

const requestBody = { email: 'valid_email@test.com' }

const makeEmailValidation = (): any => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  return {
    create: () => new EmailValidation('email', emailValidatorStub),
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should call EmailValidator with correct email', () => {
    const { create, emailValidatorStub } = makeEmailValidation()
    const emailValidation = create()
    const validatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    emailValidation.validate(requestBody)
    expect(validatorSpy).toHaveBeenCalledWith('valid_email@test.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { create, emailValidatorStub } = makeEmailValidation()
    const emailValidation = create()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(emailValidation.validate).toThrow()
  })
})
