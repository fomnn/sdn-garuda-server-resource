import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import app from '../src/app.js'

describe.skip('teacher attendance API tests', () => {
  describe('post /api/teacher-attendances', () => {
    it('should create a new teacher attendance', async () => {
      const teachers = await app.request('/api/teachers')
      const teachersData = await teachers.json()
      const teacherIds = teachersData.teachers.map((teacher: { id: number }) => teacher.id)

      const newTeacherAttendance = {
        teacher_id: faker.helpers.arrayElement(teacherIds),
      }
      const res = await app.request('/api/teacher-attendances', {
        method: 'POST',
        body: JSON.stringify(newTeacherAttendance),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(201)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Created')
      expect(body).toHaveProperty('teacher_attendance')
    })
  })
})
