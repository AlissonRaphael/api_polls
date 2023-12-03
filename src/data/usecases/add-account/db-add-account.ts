import { type AccountModel, type AddAccountModel, type AddAccount, type Hasher, type AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel | null> {
    const hashedPassword = await this.hasher.hash(account.password)
    return await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })
  }
}
