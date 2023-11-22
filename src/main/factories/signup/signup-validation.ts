import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { type Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator'

export function MakeSignUpValidation (): ValidationComposite {
  const validations: Validation[] = []
  const fields: string[] = ['name', 'email', 'password', 'passwordConfirmation']
  fields.forEach((field: string) => validations.push(new RequiredFieldValidation(field)))
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
