import { DbAuthentication } from './db-authentication'
import { type AccountModel } from '../add-account/protocols'
import { type LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { type HashComparer } from '../../protocols/criptography/hash-comparer'

const fakeAccountModel = {
  id: 0,
  name: 'Bob',
  email: 'valid_email@domain.com',
  password: 'hashed_password',
  createdAt: new Date(Date.now())
}

const fakeAuthentication = {
  email: 'valid_email@domain.com',
  password: 'any_password'
}

const makeDbAuthentication = (): any => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(fakeAccountModel) })
    }
  }

  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => { resolve(true) })
    }
  }

  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  const hashComparerStub = new HashComparerStub()
  return {
    create: () => new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub),
    loadAccountByEmailRepositoryStub,
    hashComparerStub
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

  test('Should call HashComparer with correct password', async () => {
    const { create, hashComparerStub } = makeDbAuthentication()
    const dbAuthentication = create()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await dbAuthentication.auth(fakeAuthentication)
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { create, hashComparerStub } = makeDbAuthentication()
    const dbAuthentication = create()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promiseAccessToken = dbAuthentication.auth(fakeAuthentication)
    await expect(promiseAccessToken).rejects.toThrow()
  })

  test('Should return null if HashComparer return false', async () => {
    const { create, hashComparerStub } = makeDbAuthentication()
    const dbAuthentication = create()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValue(new Promise(resolve => { resolve(false) }))
    const accessToken = await dbAuthentication.auth(fakeAuthentication)
    expect(accessToken).toBeNull()
  })
})
