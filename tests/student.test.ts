import type { students } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../prisma/db.js'
import app from '../src/app.js'

let studentIds: number[]
let newStudent: Omit<students, 'id'>
let updatedStudent: Omit<students, 'id'>
let studentWithConflictedNISN: Omit<students, 'id'>

beforeAll(async () => {
  const students = await prisma.students.findMany()
  studentIds = students.map((s: students) => s.id)

  const classes = await prisma.classes.findMany()
  const classIds = classes.map(c => c.id)

  const nisn = faker.string.numeric(8)

  newStudent = {
    nama: faker.person.fullName(),
    NISN: nisn,
    jenis_kelamin: 'male',
    class_id: faker.helpers.arrayElement(classIds),

  }
  updatedStudent = {
    nama: faker.person.fullName(),
    NISN: faker.string.numeric(8),
    jenis_kelamin: 'male',
    class_id: faker.helpers.arrayElement(classIds),
  }
  studentWithConflictedNISN = {
    nama: faker.person.fullName(),
    NISN: nisn,
    jenis_kelamin: 'male',
    class_id: faker.helpers.arrayElement(classIds),
  }
})

describe('student API tests', () => {
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
      const res = await app.request(`/api/students/${faker.helpers.arrayElement(studentIds)}`) // Gunakan ID yang ada
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('student')
    })

    it('should throw an error 404 if student not found', async () => {
      const res = await app.request('/api/students/9999') // ID yang tidak ada
      expect(res.status).toBe(404)
    })
  })

  describe('post /api/students', () => {
    it('should create a new student', async () => {
      const res = await app.request('/api/students', {
        method: 'POST',
        body: JSON.stringify(newStudent),
        // headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'Created')
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
      const res = await app.request(`/api/students/${faker.helpers.arrayElement(studentIds)}`, {
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
      const res = await app.request(`/api/students/${faker.helpers.arrayElement(studentIds)}`, {
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
      const res = await app.request(`/api/students/${faker.helpers.arrayElement(studentIds)}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body).toHaveProperty('student')
    })

    it('should throw an error 404 if student not found', async () => {
      const res = await app.request('/api/students/9999', {
        method: 'DELETE',
      })
      expect(res.status).toBe(404)
    })
  })
})
