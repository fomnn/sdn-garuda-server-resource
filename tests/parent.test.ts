import type { parents } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { describe, expect, expectTypeOf, it } from 'vitest'
import app from '../src/app.js'

let createdParentId: number

describe('parent API Tests', () => {
  const newParent: Omit<parents, 'id'> = {
    nama: faker.person.fullName(),
    jenjang_pendidikan: 'sma',
    NIK: faker.string.numeric(16),
    pekerjaan: 'Ibu Rumah Tangga',
    tahun_lahir: 2000,
    penghasilan: '0',
    email: faker.internet.email(),
  }
  const updatedParent: Omit<parents, 'id'> = {
    nama: faker.person.fullName(),
    jenjang_pendidikan: 'sma',
    NIK: faker.string.numeric(16),
    pekerjaan: 'Ibu Rumah Tangga',
    tahun_lahir: 2000,
    penghasilan: '0',
    email: faker.internet.email(),
  }
  const parentWithConflictedData: Omit<parents, 'id'> = {
    nama: faker.person.fullName(),
    jenjang_pendidikan: 'sma',
    NIK: faker.string.numeric(16),
    pekerjaan: 'Ibu Rumah Tangga',
    tahun_lahir: 2000,
    penghasilan: '0',
    email: 'parent_one@example.com',
  }

  describe('get /api/parents', () => {
    it('should get all parents', async () => {
      const res = await app.request('/api/parents')
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('parents')
    })
  })

  describe('get /api/parents/:id', () => {
    it('should get parent and their children', async () => {
      const res = await app.request('/api/parents/1')
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('parent')
      expect(body).toHaveProperty('students')
    })

    it('should throw an error 404 if parent not found', async () => {
      const res = await app.request('/api/parents/500')
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body.message).toBe('Parent not found')
    })
  })

  describe('post /api/parents', () => {
    it('should create a new parent', async () => {
      const res = await app.request('/api/parents', {
        method: 'POST',
        body: JSON.stringify(newParent),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Created')
      expect(body.parent).toMatchObject<Omit<parents, 'id'>>(newParent)
      createdParentId = body.parent.id
    })

    it('should throw an error 409 if email conflicted', async () => {
      const res = await app.request('/api/parents', {
        method: 'POST',
        body: JSON.stringify(parentWithConflictedData),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(409)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'Email already taken, use another email')
    })
  })

  describe('put /api/parents/:id', () => {
    it('should update a parent', async () => {
      const res = await app.request(`/api/parents/${createdParentId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedParent),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Updated')
      expect(body.parent).toMatchObject<Omit<parents, 'id'>>(updatedParent)
    })

    it('should throw an error 409 if any data conflicted', async () => {
      const res = await app.request(`/api/parents/${createdParentId}`, {
        method: 'PUT',
        body: JSON.stringify(parentWithConflictedData),
      })

      expect(res.status).toBe(409)
    })

    it('should throw an error 404 if parent not found', async () => {
      const res = await app.request('/api/parents/500', {
        method: 'PUT',
        body: JSON.stringify(updatedParent),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Parent not found')
    })
  })

  describe('delete /api/parents/:id', () => {
    it('should delete a parent', async () => {
      const res = await app.request(`/api/parents/${createdParentId}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body.parent).toMatchObject<Omit<parents, 'id'>>(updatedParent)
    })

    it('should throw an error 404 if parent not found', async () => {
      const res2 = await app.request('/api/parents/9999', {
        method: 'DELETE',
      })
      expect(res2.status).toBe(404)
    })
  })
})
