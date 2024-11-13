import { describe, expect, it } from 'vitest'
import app from '../src/app.js'

interface AuthData {
  email: string
  password: string
  role: 'parent' | 'teacher' | 'principal'
}

let teacherToken: string
let parentToken: string

describe('authentication tests', () => {
  describe('login as teacher', () => {
    const authDataSuccess: AuthData = {
      email: 'teacher3@example.com',
      password: 'hehe',
      role: 'teacher',
    }
    const authDataFail: AuthData = {
      email: 'teacher321@example.com',
      password: 'hehe',
      role: 'teacher',
    }

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
      expect(body).toHaveProperty('message', 'Teacher not found')
    })
  })

  describe('login as parent', () => {
    const authDataSuccess: AuthData = {
      email: 'parent_one@example.com',
      password: 'hehe',
      role: 'parent',
    }
    const authDataFail: AuthData = {
      email: 'fasdfsadf@example.com',
      password: 'hehe',
      role: 'parent',
    }

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
      expect(body).toHaveProperty('parent')
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
          authorization: `bearer ${teacherToken}`
         })
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
          authorization: `bearer ${parentToken}`
         })
      })
      expect(res.status).toBe(200)
      
      const body = await res.json()
      expect(body).toHaveProperty('token')
      expect(body).toHaveProperty('parent')
    })
  })

  it('should verify fail', async () => {
    const res = await app.request('/api/auth/verify', {
      method: 'POST',
      headers: new Headers({ 
        authorization: `bearer fasdfasdf`
       })
    })
    expect(res.status).toBe(401)
  })
})
