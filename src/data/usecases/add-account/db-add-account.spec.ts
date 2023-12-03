import { DbAddAccount } from './db-add-account'
import { type AccountModel, type AddAccountModel, type AddAccountRepository, type Hasher } from './db-add-account-protocols'

const fakeAccountModel = {
  id: 0,
  name: 'Bob',
  email: 'valid_email@domain.com',
  password: 'hashed_password',
  createdAt: new Date(Date.now())
}

const dbAddAccount = (): any => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }

  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(fakeAccountModel) })
    }
  }

  const hasherStub = new HasherStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  return {
    create: () => new DbAddAccount(hasherStub, addAccountRepositoryStub),
    hasherStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { create, hasherStub } = dbAddAccount()
    const addAccountTest = create()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await addAccountTest.add({
      name: 'Bob',
      email: 'valid_email@domain.com',
      password: '12345'
    })
    expect(hashSpy).toHaveBeenCalledWith('12345')
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { create, addAccountRepositoryStub } = dbAddAccount()
    const addAccountTest = create()
    const repositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await addAccountTest.add({
      name: 'Bob',
      email: 'valid_email@domain.com',
      password: '12345'
    })
    expect(repositorySpy).toHaveBeenCalledWith({
      name: 'Bob',
      email: 'valid_email@domain.com',
      password: 'hashed_password'
    })
  })

  test('Should return an account on success', async () => {
    const addAccountTest = dbAddAccount().create()
    const account = await addAccountTest.add({
      name: 'Bob',
      email: 'valid_email@domain.com',
      password: '12345'
    })
    expect(account).toEqual(fakeAccountModel)
  })
})
