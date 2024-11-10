import type { feedbacks } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import app from '../src/app.js'

let createdFeedbackId: number

describe('feedback API tests', () => {
  const newFeedback: Omit<feedbacks, 'id' | 'date'> & { date: string } = {
    date: new Date(faker.date.anytime().toISOString().split('T')[0]).toISOString(),
    feedback_text: faker.lorem.paragraph({ min: 1, max: 4 }),
    parent_id: faker.number.int({ min: 1, max: 5 }),
    rating: faker.number.int({ min: 1, max: 5 }),
    teacher_id: faker.number.int({ min: 1, max: 5 }),
  }

  const updatedFeedback: Omit<feedbacks, 'id' | 'date'> & { date: string } = {
    date: new Date(faker.date.anytime().toISOString().split('T')[0]).toISOString(),
    feedback_text: faker.lorem.paragraph({ min: 1, max: 4 }),
    parent_id: faker.number.int({ min: 1, max: 5 }),
    rating: faker.number.int({ min: 1, max: 5 }),
    teacher_id: faker.number.int({ min: 1, max: 5 }),
  }

  describe('get /api/feedbacks', () => {
    it('should get all feedbacks', async () => {
      const res = await app.request('/api/feedbacks')
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('feedbacks')
    })
  })

  describe('get /api/feedbacks/:id', () => {
    it('should get a feedback', async () => {
      const res = await app.request('/api/feedbacks/1') // Gunakan ID yang ada
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('feedback')
    })

    it('should throw an error 404 if feedback not found', async () => {
      const res = await app.request('/api/feedbacks/9999') // ID yang tidak ada
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Feedback not found')
    })
  })

  describe('post /api/feedbacks', () => {
    it('should create a new student', async () => {
      const res = await app.request('/api/feedbacks', {
        method: 'POST',
        body: JSON.stringify(newFeedback),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'Created')
      expect(body.feedback).toMatchObject(newFeedback)
      createdFeedbackId = body.feedback.id
    })
  })

  describe('put /api/feedbacks/:id', () => {
    it('should update a student', async () => {
      const res = await app.request(`/api/feedbacks/${createdFeedbackId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedFeedback),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Updated')
      expect(body.feedback).toMatchObject(updatedFeedback)
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/feedbacks/9999', {
        method: 'PUT',
        body: JSON.stringify(updatedFeedback),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Feedback not found')
    })
  })

  describe('delete /api/feedbacks/:id', () => {
    it('should delete a feedback', async () => {
      const res = await app.request(`/api/feedbacks/${createdFeedbackId}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body.feedback).toMatchObject(updatedFeedback)
    })

    it('should throw an error 404 if feedback not found', async () => {
      const res = await app.request('/api/feedbacks/9999', {
        method: 'DELETE',
      })
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Feedback not found')
    })
  })
})
