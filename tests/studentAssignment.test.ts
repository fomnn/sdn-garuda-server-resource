import type { student_assignments } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../prisma/db.js'
import app from '../src/app.js'

let studentAssignmentIds: number[]
let subjectIds: number[]
let newStudentAssignment: Omit<student_assignments, 'id' | 'date' | 'deadline_date'> & { date: string, deadline_date: string }
let updatedStudentAssignment: Omit<student_assignments, 'id' | 'date' | 'deadline_date'> & { date: string, deadline_date: string }

beforeAll(async () => {
  const studentAssignments = await prisma.student_assignments.findMany()
  studentAssignmentIds = studentAssignments.map(studentAssignmentData => studentAssignmentData.id)

  const subjects = await prisma.subjects.findMany()
  subjectIds = subjects.map(subjectData => subjectData.id)

  newStudentAssignment = {
    date: new Date(faker.date.anytime().toISOString().split('T')[0]).toISOString(),
    deadline_date: new Date(faker.date.soon().toISOString().split('T')[0]).toISOString(),
    subject_id: faker.helpers.arrayElement(subjectIds),
    title: faker.lorem.words({ min: 2, max: 8 }),
  }

  updatedStudentAssignment = {
    date: new Date(faker.date.anytime().toISOString().split('T')[0]).toISOString(),
    deadline_date: new Date(faker.date.soon().toISOString().split('T')[0]).toISOString(),
    subject_id: faker.helpers.arrayElement(subjectIds),
    title: faker.lorem.words({ min: 2, max: 8 }),
  }
})

describe('student assignment API tests', () => {
  describe('get /api/student-assignments', () => {
    it('should get all student assignments', async () => {
      const res = await app.request('/api/student-assignments')
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('students_assignments')
    })
  })

  describe('get /api/student-assignments/:id', () => {
    it('should get a student assignment', async () => {
      const res = await app.request(`/api/student-assignments/${faker.helpers.arrayElement(studentAssignmentIds)}`)
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('student_assignment')
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/student-assignments/500')
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body.message).toBe('Student assignment not found')
    })
  })

  describe('post /api/student-assignments', () => {
    it('should create a new student assignment', async () => {
      const res = await app.request('/api/student-assignments', {
        method: 'POST',
        body: JSON.stringify(newStudentAssignment),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Created')
      expect(body.student_assignment).toMatchObject<Omit<student_assignments, 'id' | 'date' | 'deadline_date'> & { date: string, deadline_date: string }>(newStudentAssignment)
    })
  })

  describe('put /api/student-assignments/:id', () => {
    it('should update a student assignment', async () => {
      const res = await app.request(`/api/student-assignments/${faker.helpers.arrayElement(studentAssignmentIds)}`, {
        method: 'PUT',
        body: JSON.stringify(updatedStudentAssignment),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Updated')
      expect(body.student_assignment).toMatchObject<Omit<student_assignments, 'id' | 'date' | 'deadline_date'> & { date: string, deadline_date: string }>(updatedStudentAssignment)
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/student-assignments/500', {
        method: 'PUT',
        body: JSON.stringify(updatedStudentAssignment),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Student assignment not found')
    })
  })

  describe('delete /api/student-assignments/:id', () => {
    it('should delete a student assignment', async () => {
      const res = await app.request(`/api/student-assignments/${faker.helpers.arrayElement(studentAssignmentIds)}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body).toHaveProperty('student_assignment')
    })

    it('should throw an error 404 if not found', async () => {
      const res2 = await app.request('/api/student-assignments/9999', {
        method: 'DELETE',
      })
      expect(res2.status).toBe(404)
    })
  })
})
