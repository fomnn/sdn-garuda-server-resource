import type { accounts } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { account_type } from '@prisma/client'
import { consola } from 'consola/basic'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import app from '../src/app.js'

let newAccount: Omit<accounts, 'id'>
let updatedAccount: Omit<accounts, 'id' | 'type' | 'user_id'>
let conflictedAccount: Omit<accounts, 'id'>
let accountIds: number[]

beforeAll(async () => {
  const email = faker.internet.email()
  newAccount = {
    email,
    password: faker.internet.password(),
    type: faker.helpers.enumValue(account_type),
    user_id: faker.number.int({ min: 1, max: 5 }),
  }
  updatedAccount = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
  conflictedAccount = {
    email,
    password: faker.internet.password(),
    type: faker.helpers.enumValue(account_type),
    user_id: faker.number.int({ min: 1, max: 5 }),
  }

  const accounts = await app.request('/api/accounts')
  const account = await accounts.json()
  accountIds = (account.accounts as Array<accounts>).map(account => account.id)
})

describe('account api tests', () => {
  describe('get /api/accounts', () => {
    it('should get all accounts', async () => {
      const res = await app.request('/api/accounts')
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('accounts')
    })
  })

  describe('get /api/accounts/:id', () => {
    it('should get a account', async () => {
      const res = await app.request(`/api/accounts/${faker.helpers.arrayElement(accountIds)}`)
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('account')
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/accounts/9999')
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Account not found')
    })
  })

  describe('post /api/accounts', () => {
    it('should create a new account', async () => {
      const res = await app.request('/api/accounts', {
        method: 'POST',
        body: JSON.stringify(newAccount),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Created')

      expect(body.account).toMatchObject<Omit<accounts, 'id'>>(newAccount)
      expect(body.account).toHaveProperty('id')
    })

    it('should throw an error 409 if any data conflicted', async () => {
      const res = await app.request('/api/accounts', {
        method: 'POST',
        body: JSON.stringify(conflictedAccount),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(409)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Email already taken, use another email')
    })
  })

  describe('put /api/accounts/:id', () => {
    it('should update a account', async () => {
      const res = await app.request(`/api/accounts/${faker.helpers.arrayElement(accountIds)}`, {
        method: 'PUT',
        body: JSON.stringify(updatedAccount),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Updated')
      expect(body.account).toMatchObject<Omit<accounts, 'id' | 'type' | 'user_id'>>(updatedAccount)
    })

    it('should throw an error 409 if any data conflicted', async () => {
      const res = await app.request(`/api/accounts/${faker.helpers.arrayElement(accountIds)}`, {
        method: 'PUT',
        body: JSON.stringify(conflictedAccount),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(409)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Email already taken, use another email')
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/accounts/9999', {
        method: 'PUT',
        body: JSON.stringify(updatedAccount),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Account not found')
    })
  })

  describe('delete /api/accounts/:id', () => {
    it('should delete an account', async () => {
      // consola.log(createdAccountId)
      const res = await app.request(`/api/accounts/${faker.helpers.arrayElement(accountIds)}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body).toHaveProperty('account')
    })

    it('should throw an error 404 if not found', async () => {
      const res2 = await app.request('/api/accounts/9999', {
        method: 'DELETE',
      })
      expect(res2.status).toBe(404)
    })
  })
})
