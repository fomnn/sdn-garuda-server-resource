import { beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../prisma/db.js'
import app from '../src/app.js'

interface AuthData {
  email: string
  password: string
  role: 'parent' | 'teacher' | 'principal'
}

let teacherToken: string
let parentToken: string

let authDataSuccess: AuthData
let authDataFail: AuthData

beforeAll(async () => {
  const account = await prisma.accounts.findFirst({
    select: {
      email: true,
      password: true,
      type: true,
    },
    where: {
      type: 'teacher'
    }
  })

  if (!account) {
    throw new Error('Account not found')
  }

  authDataSuccess = {
    email: account.email,
    password: account.password,
    role: account.type,
  }

  authDataFail = {
    email: 'fasdfsadf@example.com',
    password: 'hehe',
    role: 'parent',
  }
})

describe('authentication tests', () => {
  describe('login as teacher', () => {
    it('should login success', async () => {
      const res = await app.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(authDataSuccess),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()

      expect(body).toHaveProperty('message', 'Login success')
      expect(body).toHaveProperty('token')
      expect(body).toHaveProperty('teacher')

      teacherToken = body.token
    })

    it('should login fail', async () => {
      const res = await app.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(authDataFail),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message')
    })
  })

  describe('login as parent', () => {

    it('should login success', async () => {
      const res = await app.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(authDataSuccess),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Login success')
      expect(body).toHaveProperty('token')
      parentToken = body.token
    })

    it('should login fail', async () => {
      const res = await app.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(authDataFail),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Parent not found')
    })
  })

  describe('verify as teacher', () => {
    it('should verify success', async () => {
      const res = await app.request('/api/auth/verify', {
        method: 'POST',
        headers: new Headers({
          authorization: `bearer ${teacherToken}`,
        }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('token')
      expect(body).toHaveProperty('teacher')
    })
  })

  describe('verify as parent', () => {
    it('should verify success', async () => {
      const res = await app.request('/api/auth/verify', {
        method: 'POST',
        headers: new Headers({
          authorization: `bearer ${parentToken}`,
        }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('token')
    })
  })

  it('should verify fail', async () => {
    const res = await app.request('/api/auth/verify', {
      method: 'POST',
      headers: new Headers({
        authorization: `bearer fasdfasdf`,
      }),
    })
    expect(res.status).toBe(401)
  })
})
