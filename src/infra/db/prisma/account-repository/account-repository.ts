import { type Account } from '@prisma/client'
import { type AddAccountModel } from '../../../../data/usecases/add-account/protocols/index'
import { prisma } from '..'

export class AccountPostgresRepository {
  async add (account: AddAccountModel): Promise<Account> {
    return await prisma.account.create({ data: account })
  }
}
