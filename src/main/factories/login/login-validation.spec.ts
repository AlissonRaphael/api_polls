import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { type Validation } from '../../../presentation/protocols/validation'
import { type EmailValidatorAdapter } from '../../../utils/email-validator'
import { MakeLoginValidation } from './login-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): any => {
  class EmailValidatorStub implements EmailValidatorAdapter {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    MakeLoginValidation()
    const validations: Validation[] = []
    const fields: string[] = ['name', 'email']
    fields.forEach((field: string) => validations.push(new RequiredFieldValidation(field)))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
