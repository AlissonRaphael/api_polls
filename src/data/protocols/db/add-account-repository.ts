import { type AccountModel, type AddAccountModel } from '../../usecases/add-account/protocols'

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
