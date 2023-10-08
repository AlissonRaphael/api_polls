import request from 'supertest'
import { app } from '../config/app'
import prisma from '../../infra/db/prisma'

afterEach(async () => {
  const resetAccount = prisma.$queryRaw`TRUNCATE TABLE "Account";`
  const resetAccountIds = prisma.$queryRaw`ALTER SEQUENCE "Account_id_seq" RESTART WITH 1;`
  await prisma.$transaction([
    resetAccount,
    resetAccountIds
  ])
})

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any-email@domain.com',
        password: '12345',
        passwordConfirmation: '12345'
      })
      .expect(200)
  })
})
