import validator from 'validator'
import { type EmailValidator } from '../presentation/controllers/signup/protocols'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
