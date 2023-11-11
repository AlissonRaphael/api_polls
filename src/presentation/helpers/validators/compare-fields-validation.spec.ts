import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeCompareFieldsValidation = (): any => new CompareFieldsValidation('password', 'passwordConfirmation')

describe('CompareField Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const compareFieldsValidation = makeCompareFieldsValidation()
    const error = compareFieldsValidation.validate({ password: '123', passwordConfirmation: '000' })
    expect(error).toEqual(new InvalidParamError('password'))
  })

  test('Should not return validation succeeds', () => {
    const compareFieldsValidation = makeCompareFieldsValidation()
    const error = compareFieldsValidation.validate({ password: '123', passwordConfirmation: '123' })
    expect(error).toBeFalsy()
  })
})
