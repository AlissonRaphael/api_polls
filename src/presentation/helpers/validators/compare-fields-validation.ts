import { InvalidParamError } from '../../errors'
import { type Validation } from './validation'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly compareName: string
  ) {}

  validate (input: any): Error | null {
    return input[this.fieldName] !== input[this.compareName] ? new InvalidParamError(this.compareName) : null
  }
}
