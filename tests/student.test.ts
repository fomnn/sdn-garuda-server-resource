import type { students } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import app from '../src/app.js'

let createdStudentId: number

describe('student API tests', () => {
  const newStudent = {
    nama: faker.person.fullName(),
    NISN: faker.string.numeric(8),
    jenis_kelamin: 'male',
  }
  const updatedStudent = {
    nama: faker.person.fullName(),
    NISN: faker.string.numeric(8),
    jenis_kelamin: 'male',
  }
  const studentWithConflictedNISN = {
    nama: faker.person.fullName(),
    NISN: 'S123456',
    jenis_kelamin: 'male',
  }

  describe('get /api/students', () => {
    it('should get all students', async () => {
      const res = await app.request('/api/students')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('students')
    })
  })

  describe('get /api/students/:id', () => {
    it('should get a student', async () => {
      const res = await app.request('/api/students/1') // Gunakan ID yang ada
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('student')
    })

    it('should throw an error 404 if student not found', async () => {
      const res = await app.request('/api/students/500') // ID yang tidak ada
      expect(res.status).toBe(404)
    })
  })

  describe('post /api/students', () => {
    it('should create a new student', async () => {
      const res = await app.request('/api/students', {
        method: 'POST',
        body: JSON.stringify(newStudent),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'Created')

      // Mengambil ID student yang dibuat
      const studentsRes = await app.request('/api/students')
      const studentsBody = await studentsRes.json()
      createdStudentId = studentsBody.students.find((s: students) => s.NISN === newStudent.NISN).id
    })

    it('should throw an error 409 if NISN conflicted', async () => {
      const res = await app.request('/api/students', {
        method: 'POST',
        body: JSON.stringify(studentWithConflictedNISN),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(409)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'NISN already used')
    })
  })

  describe('put /api/students/:id', () => {
    it('should update a student', async () => {
      const res = await app.request(`/api/students/${createdStudentId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedStudent),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Updated')
      expect(body.student).toMatchObject(updatedStudent)
    })

    it('should throw an error 409 if NISN conflicted', async () => {
      const res = await app.request(`/api/students/${createdStudentId}`, {
        method: 'PUT',
        body: JSON.stringify(studentWithConflictedNISN),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(409)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'NISN already used')
    })

    it('should throw an error 404 if student not found', async () => {
      const res = await app.request('/api/students/9999', {
        method: 'PUT',
        body: JSON.stringify(updatedStudent),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(404)
    })
  })

  describe('delete /api/students/:id', () => {
    it('should delete a student', async () => {
      const res = await app.request(`/api/students/${createdStudentId}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body.student).toMatchObject(updatedStudent)
    })

    it('should throw an error 404 if student not found', async () => {
      const res = await app.request('/api/students/9999', {
        method: 'DELETE',
      })
      expect(res.status).toBe(404)
    })
  })
})
