import { prismaMock } from '../singleton'
import { AccountPostgresRepository } from './account-repository'

const user = {
  id: 1,
  name: 'any_name',
  email: 'any_email@domain.com',
  password: '12345',
  createdAt: new Date(Date.now())
}

prismaMock.account.create.mockResolvedValue(user)

describe('Account Postgres Repository', () => {
  test('Should return an account on success', async () => {
    const accountPostgresRepository = new AccountPostgresRepository()

    await expect(accountPostgresRepository.add({
      name: 'any_name',
      email: 'any_email@domain.com',
      password: '12345'
    })).resolves.toEqual(user)

    // expect(account).toBeTruthy()
    // expect(account.id).toBe(1)
    // expect(account.name).toMatch('any_name')
    // expect(account.email).toMatch('any_email@domain.com')
    // expect(account.password).toMatch('12345')
  })
})
