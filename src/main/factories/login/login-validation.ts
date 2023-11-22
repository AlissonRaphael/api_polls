import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { type Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator'

export function MakeLoginValidation (): ValidationComposite {
  const validations: Validation[] = []
  const fields: string[] = ['name', 'email']
  fields.forEach((field: string) => validations.push(new RequiredFieldValidation(field)))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
