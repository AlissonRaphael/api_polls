import { type AccountModel, type AddAccountModel, type AddAccount, type Encrypter, type AddAccountRepository } from './protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel | null> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    return await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })
  }
}
