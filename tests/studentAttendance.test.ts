import { faker } from '@faker-js/faker'
import { student_attendance_status, type student_attendances } from '@prisma/client'
import { beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../prisma/db.js'
import app from '../src/app.js'

let studentAttendanceIds: number[]
let studentIds: number[]
let classesIds: number[]
let newAttendance: Omit<student_attendances, 'id'>
let updatedAttendance: Omit<student_attendances, 'id'>

beforeAll(async () => {
  const studentAttendances = await prisma.student_attendances.findMany()
  studentAttendanceIds = studentAttendances.map(studentAttendanceData => studentAttendanceData.id)

  const students = await prisma.students.findMany()
  studentIds = students.map(studentData => studentData.id)

  const classes = await prisma.classes.findMany()
  classesIds = classes.map(classData => classData.id)

  newAttendance = {
    class_id: faker.helpers.arrayElement(classesIds),
    date: new Date(faker.date.anytime().toISOString().split('T')[0]),
    status: faker.helpers.enumValue(student_attendance_status),
    student_id: faker.helpers.arrayElement(studentIds),
  }

  updatedAttendance = {
    class_id: faker.helpers.arrayElement(classesIds),
    date: new Date(faker.date.anytime().toISOString().split('T')[0]),
    status: faker.helpers.enumValue(student_attendance_status),
    student_id: faker.helpers.arrayElement(studentIds),
  }
})

describe('attendance API tests', () => {
  describe('get /api/attendances', () => {
    it('should get all attendances', async () => {
      const res = await app.request('/api/attendances')
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('attendances')
    })
  })

  describe('get /api/attendances/:id', () => {
    it('should get a attendance', async () => {
      const res = await app.request(`/api/attendances/${faker.helpers.arrayElement(studentAttendanceIds)}`)
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('attendance')
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/attendances/9999')
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Attendance not found')
    })
  })

  describe('post /api/attendances', () => {
    it('should create a new attendance', async () => {
      const res = await app.request('/api/attendances', {
        method: 'POST',
        body: JSON.stringify(newAttendance),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Created')

      expect(body.attendance).toMatchObject<Omit<student_attendances, 'id' | 'date'> & { date: string }>({
        ...newAttendance,
        date: newAttendance.date!.toISOString(),
      })
    })
  })

  describe('put /api/attendances/:id', () => {
    it('should update a attendance', async () => {
      const res = await app.request(`/api/attendances/${faker.helpers.arrayElement(studentAttendanceIds)}`, {
        method: 'PUT',
        body: JSON.stringify(updatedAttendance),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Updated')
      expect(body.attendance).toMatchObject<Omit<student_attendances, 'id' | 'date'> & { date: string }>({
        ...updatedAttendance,
        date: updatedAttendance.date!.toISOString(),
      })
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/attendances/9999', {
        method: 'PUT',
        body: JSON.stringify(updatedAttendance),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Attendance not found')
    })
  })

  describe('delete /api/attendances/:id', () => {
    it('should delete a attendance', async () => {
      const res = await app.request(`/api/attendances/${faker.helpers.arrayElement(studentAttendanceIds)}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body).toHaveProperty('attendance')
    })

    it('should throw an error 404 if not found', async () => {
      const res2 = await app.request('/api/attendances/9999', {
        method: 'DELETE',
      })
      expect(res2.status).toBe(404)
    })
  })
})
