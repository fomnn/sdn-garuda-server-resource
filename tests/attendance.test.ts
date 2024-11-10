import { faker } from '@faker-js/faker'
import { attendance_status, type attendances } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import app from '../src/app.js'

let createdAttendanceId: number

describe('attendance API tests', () => {
  const newAttendance: Omit<attendances, 'id'> = {
    class_id: faker.number.int({ min: 1, max: 5 }),
    date: new Date(faker.date.anytime().toISOString().split('T')[0]),
    status: faker.helpers.enumValue(attendance_status),
    student_id: faker.number.int({ min: 1, max: 5 }),
  }

  const updatedAttendance: Omit<attendances, 'id'> = {
    class_id: faker.number.int({ min: 1, max: 5 }),
    date: new Date(faker.date.anytime().toISOString().split('T')[0]),
    status: faker.helpers.enumValue(attendance_status),
    student_id: faker.number.int({ min: 1, max: 5 }),
  }

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
      const res = await app.request('/api/attendances/1')
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('attendance')
    })

    it('should throw an error 400 if not found', async () => {
      const res = await app.request('/api/attendances/9999')
      expect(res.status).toBe(400)

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

      expect(body.attendance).toMatchObject<Omit<attendances, 'id' | 'date'> & { date: string }>({
        ...newAttendance,
        date: newAttendance.date!.toISOString(),
      })
      createdAttendanceId = body.attendance.id
    })
  })

  describe('put /api/attendances/:id', () => {
    it('should update a attendance', async () => {
      const res = await app.request(`/api/attendances/${createdAttendanceId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedAttendance),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Updated')
      expect(body.attendance).toMatchObject<Omit<attendances, 'id' | 'date'> & { date: string }>({
        ...updatedAttendance,
        date: updatedAttendance.date!.toISOString(),
      })
    })

    it('should throw an error 400 if not found', async () => {
      const res = await app.request('/api/attendances/9999', {
        method: 'PUT',
        body: JSON.stringify(updatedAttendance),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(400)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Attendance not found')
    })
  })

  describe('delete /api/attendances/:id', () => {
    it('should delete a attendace', async () => {
      const res = await app.request(`/api/attendances/${createdAttendanceId}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body.attendance).toMatchObject<Omit<attendances, 'id' | 'date'> & { date: string }>({
        ...updatedAttendance,
        date: updatedAttendance.date!.toISOString(),
      })
    })

    it('should throw an error 400 if not found', async () => {
      const res2 = await app.request('/api/attendances/9999', {
        method: 'DELETE',
      })
      expect(res2.status).toBe(400)
    })
  })
})
