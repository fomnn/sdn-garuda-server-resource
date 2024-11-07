import type { students } from '@prisma/client'
import { expect, describe, test } from 'vitest'
import app from '../src/app.js' // Asumsi 'app' menggunakan studentRouter

let createdStudentId: number

describe('Student API Tests', () => {
  describe('GET /api/students', () => {
    test('Should get all students', async () => {
      const res = await app.request('/api/students')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('students')
    })
  })

  describe('GET /api/students/:id', () => {
    test('Should get a student', async () => {
      const res = await app.request('/api/students/1') // Gunakan ID yang ada
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('student')
    })

    test('Should return 400 if student not found', async () => {
      const res = await app.request('/api/students/500') // ID yang tidak ada
      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/students', () => {
    test('Should create a new student', async () => {
      const newStudent = {
        nama: 'Test Student',
        NISN: '123456789',
        jenis_kelamin: 'male',
      }

      const res = await app.request('/api/students', {
        method: 'POST',
        body: JSON.stringify(newStudent),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'success')

      // Mengambil ID student yang dibuat
      const studentsRes = await app.request('/api/students')
      const studentsBody = await studentsRes.json()
      createdStudentId = studentsBody.students.find((s: students) => s.NISN === newStudent.NISN).id
    })
  })

  describe('PUT /api/students/:id', () => {
    test('Should update a student', async () => {
      const updatedStudent = {
        nama: 'Updated Student',
        NISN: '123456789',
        jenis_kelamin: 'female',
      }

      const res = await app.request(`/api/students/${createdStudentId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedStudent),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'success')
    })

    test('Should return 400 if student not found', async () => {
      const updatedStudent = {
        nama: 'Nonexistent Student',
        NISN: '987654321',
        jenis_kelamin: 'Perempuan',
      }

      const res = await app.request('/api/students/9999', {
        method: 'PUT',
        body: JSON.stringify(updatedStudent),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(400)
    })
  })

  describe('DELETE /api/students/:id', () => {
    test('Should delete a student', async () => {
      const res = await app.request(`/api/students/${createdStudentId}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'success')
    })

    test('Should return 400 if student not found', async () => {
      const res = await app.request('/api/students/9999', {
        method: 'DELETE',
      })
      expect(res.status).toBe(400)
    })
  })
})
