import prisma from '..'
import { type AccountModel, type AddAccountModel } from '../../../../data/usecases/add-account/db-add-account-protocols'

export class AccountPostgresRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    return await prisma.account.create({ data: account })
  }
}
