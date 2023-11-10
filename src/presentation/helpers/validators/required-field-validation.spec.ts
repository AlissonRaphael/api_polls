import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeRequiredFieldValidation = (): any => new RequiredFieldValidation('field')

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const requiredFieldValidation = makeRequiredFieldValidation()
    const error = requiredFieldValidation.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return validation succeeds', () => {
    const requiredFieldValidation = makeRequiredFieldValidation()
    const error = requiredFieldValidation.validate({ field: 'any_name' })
    expect(error).toBeFalsy()
  })
})
