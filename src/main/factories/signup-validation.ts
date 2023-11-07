import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export function MakeSignUpValidation (): ValidationComposite {
  const fields: string[] = ['name', 'email', 'password', 'passwordConfirmation']
  return new ValidationComposite(fields.map(field => new RequiredFieldValidation(field)))
}
