import type { subjects } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'
import app from '../src/app.js'

let createdSubjectId: number
let subjectId: number
let newSubject: Omit<subjects, 'id'>
let updatedSubject: Omit<subjects, 'id'>

beforeEach(async () => {
  newSubject = {
    subject_name: faker.lorem.words({ min: 1, max: 6 }),
  }
  updatedSubject = {
    subject_name: faker.lorem.words({ min: 1, max: 6 }),
  }

  const subjects = await app.request('/api/subjects')
  const subjectsJson = await subjects.json()

  subjectId = subjectsJson.subjects[0].id
})

describe('subject API tests', () => {
  describe('get /api/subjects', () => {
    it('should get all subjects', async () => {
      const res = await app.request('/api/subjects')
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('subjects')
    })
  })

  describe('get /api/subjects/:id', () => {
    it('should get a subject', async () => {
      const res = await app.request(`/api/subjects/${subjectId}`)
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('subject')
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/subjects/9999')
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Subject not found')
    })
  })

  describe('post /api/subjects', () => {
    it('should create a new subject', async () => {
      const res = await app.request('/api/subjects', {
        method: 'POST',
        body: JSON.stringify(newSubject),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Created')

      expect(body.subject).toMatchObject<Omit<subjects, 'id'>>(newSubject)

      createdSubjectId = body.subject.id
    })
  })

  describe('put /api/subjects/:id', () => {
    it('should update a subject', async () => {
      const res = await app.request(`/api/subjects/${createdSubjectId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedSubject),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Updated')
      expect(body.subject).toMatchObject<Omit<subjects, 'id'>>(updatedSubject)
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/subjects/9999', {
        method: 'PUT',
        body: JSON.stringify(updatedSubject),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Subject not found')
    })
  })

  describe('delete /api/subjects/:id', () => {
    it('should delete a subject', async () => {
      const res = await app.request(`/api/subjects/${createdSubjectId}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body).toHaveProperty('subject')
    })

    it('should throw an error 404 if not found', async () => {
      const res2 = await app.request('/api/subjects/9999', {
        method: 'DELETE',
      })
      expect(res2.status).toBe(404)
    })
  })
})
