import type { parents } from '@prisma/client'
import { expect, describe, test } from 'vitest'
import app from '../src/app.js'

let createdParentId: number

describe('Parent API Tests', () => {
  describe('GET /api/parents', () => {
    test('Should get all parents', async () => {
      const res = await app.request('/api/parents')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('parents')
    })
  })

  describe('GET /api/parents/:id', () => {
    test('Should get parent and their children', async () => {
      const res = await app.request('/api/parents/1')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('parent')
      expect(body).toHaveProperty('students')
    })

    test('Should return 400 if parent not found', async () => {
      const res2 = await app.request('/api/parents/500')
      expect(res2.status).toBe(400)
    })
  })

  describe('POST /api/parents', () => {
    test('Should create a new parent', async () => {
      const newParent: Omit<parents, 'id'> = {
        nama: 'fasdf',
        jenjang_pendidikan: 'sma',
        NIK: '123124124',
        pekerjaan: 'Ibu Rumah Tangga',
        tahun_lahir: 2000,
        penghasilan: '0',
        email: 'fsdkjf@fsd.fds'
      }

      const res = await app.request('/api/parents', {
        method: 'POST',
        body: JSON.stringify(newParent),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(200)
      const parent = (await res.json()).parent
      createdParentId = parent.id
    })
  })

  describe('PUT /api/parents/:id', () => {
    test('Should update a parent', async () => {
      const updatedParent: Omit<parents, 'id'> = {
        nama: 'updated',
        jenjang_pendidikan: 's1',
        NIK: '123124124',
        pekerjaan: 'Ibu Rumah Tangga',
        tahun_lahir: 2000,
        penghasilan: '0',
        email: 'tesupdate@gsdlf.sdf'
      }

      const res = await app.request(`/api/parents/${createdParentId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedParent),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(200)
    })

    test('Should return 400 if parent not found', async () => {
      const updatedParent: Omit<parents, 'id'> = {
        nama: 'updated',
        jenjang_pendidikan: 's1',
        NIK: '123124124',
        pekerjaan: 'Ibu Rumah Tangga',
        tahun_lahir: 2000,
        penghasilan: '0',
        email: 'tesupdate@gsdlf.sdf'
      }

      const res2 = await app.request('/api/parents/500', {
        method: 'PUT',
        body: JSON.stringify(updatedParent),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res2.status).toBe(400)
    })
  })

  describe('DELETE /api/parents/:id', () => {
    test('Should delete a parent', async () => {
      const res = await app.request(`/api/parents/${createdParentId}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)
    })

    test('Should return 400 if parent not found', async () => {
      const res2 = await app.request('/api/parents/5', {
        method: 'DELETE',
      })
      expect(res2.status).toBe(400)
    })
  })
})
