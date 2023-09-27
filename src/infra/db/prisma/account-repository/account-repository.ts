import { prisma } from '..'
import { type AccountModel, type AddAccountModel } from '../../../../data/usecases/add-account/protocols/index'

export class AccountPostgresRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    return await prisma.account.create({ data: account })
  }
}
