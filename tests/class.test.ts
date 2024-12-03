import type { classes } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../prisma/db.js'
import app from '../src/app.js'

let createdClassId: number
let classIds: number[]
let newClass: Omit<classes, 'id'>
let updatedClass: Omit<classes, 'id'>
let teacherIds: number[]

beforeAll(async () => {
  const classes = await prisma.classes.findMany()
  classIds = classes.map(classData => classData.id)

  const teachers = await prisma.teachers.findMany()
  teacherIds = teachers.map(teacherData => teacherData.id)

  newClass = {
    class_name: faker.lorem.words({ min: 2, max: 4 }),
    teacher_id: faker.helpers.arrayElement(teacherIds),
  }

  updatedClass = {
    class_name: faker.lorem.words({ min: 2, max: 4 }),
    teacher_id: faker.helpers.arrayElement(teacherIds),
  }
})

describe('class API Tests', () => {
  describe('get /api/classes', () => {
    it('should get all classes', async () => {
      const res = await app.request('/api/classes')
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('classes')
    })
  })

  describe('get /api/classes/:id', () => {
    it('should get a class', async () => {
      const res = await app.request(`/api/classes/${faker.helpers.arrayElement(classIds)}`)
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('class')
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/classes/9999')
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Class not found')
    })
  })

  describe('post /api/classes', () => {
    it('should create a new class', async () => {
      const res = await app.request('/api/classes', {
        method: 'POST',
        body: JSON.stringify(newClass),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Created')
      expect(body.class).toMatchObject<Omit<classes, 'id'>>(newClass)
      createdClassId = body.class.id
    })
  })

  describe('put /api/classes/:id', () => {
    it('should update a class', async () => {
      const res = await app.request(`/api/classes/${createdClassId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedClass),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Updated')
      expect(body.class).toMatchObject<Omit<classes, 'id'>>(updatedClass)
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/classes/9999', {
        method: 'PUT',
        body: JSON.stringify(updatedClass),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Class not found')
    })
  })

  describe('delete /api/classes/:id', () => {
    it('should delete a class', async () => {
      const res = await app.request(`/api/classes/${createdClassId}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body.class).toMatchObject<Omit<classes, 'id'>>(updatedClass)
    })

    it('should throw an error 404 if not found', async () => {
      const res2 = await app.request('/api/classes/9999', {
        method: 'DELETE',
      })
      expect(res2.status).toBe(404)
    })
  })
})
