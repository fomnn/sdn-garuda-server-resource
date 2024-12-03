import type { student_grades } from '@prisma/client'
import type { Decimal } from '@prisma/client/runtime/library'
import { faker } from '@faker-js/faker'
import { beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../prisma/db.js'
import app from '../src/app.js'

let studentGradeIds: number[]
let newStudentGrade: Omit<student_grades, 'id'>
let updatedStudentGrade: Omit<student_grades, 'id'>

beforeAll(async () => {
  const studentGrades = await prisma.student_grades.findMany()
  studentGradeIds = studentGrades.map(studentGrade => studentGrade.id)

  const students = await prisma.students.findMany()
  const studentIds = students.map(student => student.id)

  const studentAssignments = await prisma.student_assignments.findMany()
  const studentAssignmentIds = studentAssignments.map(studentAssignment => studentAssignment.id)

  newStudentGrade = {
    grade: faker.number.int({ min: 10, max: 100 }) as unknown as Decimal,
    student_assignment_id: faker.helpers.arrayElement(studentAssignmentIds),
    term: faker.lorem.words(5),
    student_id: faker.helpers.arrayElement(studentIds),
  }
  updatedStudentGrade = {
    grade: faker.number.int({ min: 10, max: 100 }) as unknown as Decimal,
    student_assignment_id: faker.helpers.arrayElement(studentAssignmentIds),
    term: faker.lorem.words(5),
    student_id: faker.helpers.arrayElement(studentIds),
  }
})

describe('student grade api tests', () => {
  describe('get /api/student-grades', () => {
    it('should get all student grades', async () => {
      const res = await app.request('/api/student-grades')
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('student_grades')
    })
  })

  describe('get /api/student-grades/:id', () => {
    it('should get a student grade', async () => {
      const res = await app.request(`/api/student-grades/${faker.helpers.arrayElement(studentGradeIds)}`)
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('student_grade')
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/student-grades/999')
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body.message).toBe('Student grade not found')
    })
  })

  describe('post /api/student-grades', () => {
    it('should create a new student grade', async () => {
      const res = await app.request('/api/student-grades', {
        method: 'POST',
        body: JSON.stringify(newStudentGrade),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Created')
      expect(body).toHaveProperty('student_grade')
    })
  })

  describe('put /api/student-grades/:id', () => {
    it('should update a student grade', async () => {
      const res = await app.request(`/api/student-grades/${faker.helpers.arrayElement(studentGradeIds)}`, {
        method: 'PUT',
        body: JSON.stringify(updatedStudentGrade),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Updated')
      expect(body.student_grade).toMatchObject<Omit<student_grades, 'id' | 'grade'> & { grade: string }>({
        ...updatedStudentGrade,
        grade: updatedStudentGrade.grade.toString(),
      })
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/student-grades/500', {
        method: 'PUT',
        body: JSON.stringify(updatedStudentGrade),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Student grade not found')
    })
  })

  describe('delete /api/student-grades/:id', () => {
    it('should delete a student grade', async () => {
      const res = await app.request(`/api/student-grades/${faker.helpers.arrayElement(studentGradeIds)}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body).toHaveProperty('student_grade')
    })

    it('should throw an error 404 if not found', async () => {
      const res2 = await app.request('/api/student-grades/9999', {
        method: 'DELETE',
      })
      expect(res2.status).toBe(404)
    })
  })
})
