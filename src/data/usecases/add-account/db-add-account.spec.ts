import { DbAddAccount } from './db-add-account'
import { type AccountModel, type AddAccountModel, type AddAccountRepository, type Encrypter } from './protocols'

const dbAddAccount = (): any => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }

  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => {
        resolve({
          id: 0,
          name: 'Bob',
          email: 'valid_email@domain.com'
        })
      })
    }
  }

  const encrypterStub = new EncrypterStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  return {
    create: () => new DbAddAccount(encrypterStub, addAccountRepositoryStub),
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call encrypter with correct password', async () => {
    const { create, encrypterStub } = dbAddAccount()
    const addAccountTest = create()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await addAccountTest.add({
      name: 'Bob',
      email: 'valid_email@domain.com',
      password: '12345'
    })
    expect(encryptSpy).toHaveBeenCalledWith('12345')
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
    expect(account).toEqual({
      id: 0,
      name: 'Bob',
      email: 'valid_email@domain.com'
    })
  })
})
