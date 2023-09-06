import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator'

jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true)
const emailValidatorAdapter = (): any => ({ create: () => new EmailValidatorAdapter() })

describe('EmailValidator Adapter', () => {
  test('Should call validator with correct email', () => {
    const emailValidator = emailValidatorAdapter().create()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    emailValidator.isValid('any_email@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return false if validator return false', () => {
    const emailValidator = emailValidatorAdapter().create()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = emailValidator.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const emailValidator = emailValidatorAdapter().create()
    const isValid = emailValidator.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })
})
