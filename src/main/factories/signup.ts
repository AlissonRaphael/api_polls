import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator'
import { AccountPostgresRepository } from '../../infra/db/prisma/account-repository/account-repository'
import { LogControllerDecorator } from '../decorators/log'
import { type Controller } from '../../presentation/protocols'
import { LogErrorPostgresRepository } from '../../infra/db/prisma/log-repository/log-repository'
import { MakeSignUpValidation } from './signup-validation'

export function MakeSignUpController (): Controller {
  const salt = 12
  const validation = MakeSignUpValidation()
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountPostgresRepository = new AccountPostgresRepository()
  const addAccount = new DbAddAccount(bcryptAdapter, accountPostgresRepository)
  const signUpController = new SignUpController(validation, emailValidatorAdapter, addAccount)
  const logErrorPostgresRepository = new LogErrorPostgresRepository()
  return new LogControllerDecorator(signUpController, logErrorPostgresRepository)
}
