import { InvalidParamError, MissingParamError } from '../../errors'
import { type Validation } from '../../protocols/validation'
import { ValidationComposite } from './validation-composite'

const makeValidationComposite = (): any => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  const validationStubs = [new ValidationStub(), new ValidationStub()]
  return {
    create: () => new ValidationComposite(validationStubs),
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { validationStubs, create } = makeValidationComposite()
    const validationComposite = create()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('required_field'))
    const error = validationComposite.validate({ any_field: 'any_value' })
    expect(error).toEqual(new MissingParamError('required_field'))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { validationStubs, create } = makeValidationComposite()
    const validationComposite = create()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('required_field'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new InvalidParamError('invalid_field'))
    const error = validationComposite.validate({ any_field: 'any_value' })
    expect(error).toEqual(new MissingParamError('required_field'))
  })

  test('Should not return if validation succeeds', () => {
    const { create } = makeValidationComposite()
    const validationComposite = create()
    const error = validationComposite.validate({ required_field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
