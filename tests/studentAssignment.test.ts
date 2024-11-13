import type { student_assignments } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import app from '../src/app.js'

let createdStudentAssignmentId: number

describe('student assignment API tests', () => {
  const newStudentAssignment: Omit<student_assignments, 'id' | 'date' | 'deadline_date'> & { date: string, deadline_date: string } = {
    date: new Date(faker.date.anytime().toISOString().split('T')[0]).toISOString(),
    deadline_date: new Date(faker.date.soon().toISOString().split('T')[0]).toISOString(),
    subject_id: faker.number.int({ min: 1, max: 5 }),
    title: faker.lorem.words({ min: 2, max: 8 }),
  }
  const updatedStudentAssignment: Omit<student_assignments, 'id' | 'date' | 'deadline_date'> & { date: string, deadline_date: string } = {
    date: new Date(faker.date.anytime().toISOString().split('T')[0]).toISOString(),
    deadline_date: new Date(faker.date.soon().toISOString().split('T')[0]).toISOString(),
    subject_id: faker.number.int({ min: 1, max: 5 }),
    title: faker.lorem.words({ min: 2, max: 8 }),
  }

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
      const res = await app.request('/api/student-assignments/1')
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
      createdStudentAssignmentId = body.student_assignment.id
    })
  })

  describe('put /api/student-assignments/:id', () => {
    it('should update a student assignment', async () => {
      const res = await app.request(`/api/student-assignments/${createdStudentAssignmentId}`, {
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
      const res = await app.request(`/api/student-assignments/${createdStudentAssignmentId}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body.student_assignment).toMatchObject<Omit<student_assignments, 'id' | 'date' | 'deadline_date'> & { date: string, deadline_date: string }>(updatedStudentAssignment)
    })

    it('should throw an error 404 if not found', async () => {
      const res2 = await app.request('/api/student-assignments/9999', {
        method: 'DELETE',
      })
      expect(res2.status).toBe(404)
    })
  })
})
