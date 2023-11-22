import { type EmailValidator } from '../../controllers/signup/protocols'
import { InvalidParamError } from '../../errors'
import { type Validation } from '../../protocols/validation'

export class EmailValidation implements Validation {
  constructor (
    private readonly email: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | null {
    const emailIsValid = this.emailValidator.isValid(input[this.email])
    if (!emailIsValid) return new InvalidParamError(this.email)
    return null
  }
}
