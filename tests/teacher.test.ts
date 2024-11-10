import type { teachers } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import app from '../src/app.js'

let createdTeacherId: number

describe('teacher API Tests', () => {
  const newTeacher: Omit<teachers, 'id'> = {
    nama: faker.person.fullName({ sex: 'female' }),
    jenis_kelamin: 'female',
    NIP: faker.string.numeric(8),
    NUPTK: faker.string.numeric(12),
    email: faker.internet.email(),
    tanggal_lahir: faker.date.anytime(),
  }
  const updatedTeacher: Omit<teachers, 'id'> = {
    nama: faker.person.fullName({ sex: 'female' }),
    jenis_kelamin: 'female',
    NIP: faker.string.numeric(8),
    NUPTK: faker.string.numeric(12),
    email: faker.internet.email(),
    tanggal_lahir: faker.date.anytime(),
  }
  const teacherWithSomeDataConflicted: Omit<teachers, 'id'> = {
    nama: faker.person.fullName({ sex: 'female' }),
    jenis_kelamin: 'female',
    NIP: '12345',
    NUPTK: faker.string.numeric(12),
    email: 'teacher1@example.com',
    tanggal_lahir: faker.date.anytime(),
  }

  describe('get /api/teachers', () => {
    it('should get all teachers', async () => {
      const res = await app.request('/api/teachers')
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('teachers')
    })
  })

  describe('get /api/teachers/:id', () => {
    it('should get a teacher', async () => {
      const res = await app.request('/api/teachers/1')
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('teacher')
    })

    it('should throw error 404 if not found', async () => {
      const res = await app.request('/api/teachers/9999')
      expect(res.status).toBe(404)
    })
  })

  describe('post /api/teachers', () => {
    it('should create a new teacher', async () => {
      const res = await app.request('/api/teachers', {
        method: 'POST',
        body: JSON.stringify(newTeacher),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.message).toBe('Created')

      createdTeacherId = body.teacher.id
    })

    it('should throw an error 409 if any data conflicted', async () => {
      const res = await app.request('/api/teachers', {
        method: 'POST',
        body: JSON.stringify(teacherWithSomeDataConflicted),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
      expect(res.status).toBe(409)

      const body = await res.json()
      expect(body.message).toBe('email, NIP, or NUPTK is conflicted')
    })
  })

  describe('put /api/teachers/:id', () => {
    it('should update a teacher', async () => {
      const res = await app.request(`/api/teachers/${createdTeacherId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTeacher),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.message).toBe('Updated')
      expect(body).toHaveProperty('teacher')
    })

    it('should throw an error 409 if any data conflicted', async () => {
      const res = await app.request(`/api/teachers/${createdTeacherId}`, {
        method: 'PUT',
        body: JSON.stringify(teacherWithSomeDataConflicted),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(409)

      const body = await res.json()
      expect(body.message).toBe('email, NIP, or NUPTK is conflicted')
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/teachers/9999', {
        method: 'PUT',
        body: JSON.stringify(updatedTeacher),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body.message).toBe('Teacher not found')
    })
  })

  describe('delete /api/teachers/:id', () => {
    it('should delete a teacher', async () => {
      const res = await app.request(`/api/teachers/${createdTeacherId}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.message).toBe('Deleted')
      expect(body).toHaveProperty('teacher')
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/teachers/9999', {
        method: 'DELETE',
      })
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Teacher not found')
    })
  })
})
