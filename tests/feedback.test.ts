import type { feedbacks } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../prisma/db.js'
import app from '../src/app.js'

let feedbackIds: number[]
let parentIds: number[]
let teacherIds: number[]
let newFeedback: Omit<feedbacks, 'id' | 'date'> & { date: string }
let updatedFeedback: Omit<feedbacks, 'id' | 'date'> & { date: string }

beforeAll(async () => {
  const feedbacks = await prisma.feedbacks.findMany()
  feedbackIds = feedbacks.map(feedbackData => feedbackData.id)

  const parents = await prisma.parents.findMany()
  parentIds = parents.map(parentData => parentData.id)

  const teachers = await prisma.teachers.findMany()
  teacherIds = teachers.map(teacherData => teacherData.id)

  newFeedback = {
    date: new Date(faker.date.anytime().toISOString().split('T')[0]).toISOString(),
    feedback_text: faker.lorem.paragraph({ min: 1, max: 4 }),
    parent_id: faker.helpers.arrayElement(parentIds),
    rating: faker.number.int({ min: 1, max: 5 }),
    teacher_id: faker.helpers.arrayElement(teacherIds),
  }

  updatedFeedback = {
    date: new Date(faker.date.anytime().toISOString().split('T')[0]).toISOString(),
    feedback_text: faker.lorem.paragraph({ min: 1, max: 4 }),
    parent_id: faker.helpers.arrayElement(parentIds),
    rating: faker.number.int({ min: 1, max: 5 }),
    teacher_id: faker.helpers.arrayElement(teacherIds),
  }
})

describe('feedback API tests', () => {
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
      const res = await app.request(`/api/feedbacks/${faker.helpers.arrayElement(feedbackIds)}`) // Gunakan ID yang ada
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
    })
  })

  describe('put /api/feedbacks/:id', () => {
    it('should update a student', async () => {
      const res = await app.request(`/api/feedbacks/${faker.helpers.arrayElement(feedbackIds)}`, {
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
      const res = await app.request(`/api/feedbacks/${faker.helpers.arrayElement(feedbackIds)}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body).toHaveProperty('feedback')
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
