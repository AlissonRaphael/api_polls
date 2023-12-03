import { DbAuthentication } from './db-authentication'
import { type AccountModel } from '../add-account/protocols'
import { type LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

const fakeAccountModel = {
  id: 0,
  name: 'Bob',
  email: 'valid_email@domain.com',
  password: 'hashed_password',
  createdAt: new Date(Date.now())
}

const fakeAuthentication = {
  name: 'Bob',
  email: 'valid_email@domain.com'
}

const makeDbAuthentication = (): any => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(fakeAccountModel) })
    }
  }

  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  return {
    create: () => new DbAuthentication(loadAccountByEmailRepositoryStub),
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { create, loadAccountByEmailRepositoryStub } = makeDbAuthentication()
    const dbAuthentication = create()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await dbAuthentication.auth(fakeAuthentication)
    expect(loadSpy).toHaveBeenCalledWith('valid_email@domain.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { create, loadAccountByEmailRepositoryStub } = makeDbAuthentication()
    const dbAuthentication = create()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promiseAccessToken = dbAuthentication.auth(fakeAuthentication)
    await expect(promiseAccessToken).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository return null', async () => {
    const { create, loadAccountByEmailRepositoryStub } = makeDbAuthentication()
    const dbAuthentication = create()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValue(null)
    const accessToken = await dbAuthentication.auth(fakeAuthentication)
    expect(accessToken).toBeNull()
  })
})
