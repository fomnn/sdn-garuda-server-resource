import type { posts_paragraphs } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import app from '../src/app.js'

let createdPostParagraphId: number

type PostParagraph = Omit<posts_paragraphs, 'id'>
type PostParagraphUpdate = Omit<PostParagraph, 'post_id'>

describe('post API tests', () => {
  const newPostParagraph: PostParagraph = {
    content: faker.lorem.paragraph(),
    post_id: faker.number.int({ min: 1, max: 5 }),
    paragraph_order: faker.number.int({ min: 1, max: 5 }),
  }
  const updatedPostParagraph: PostParagraphUpdate = {
    content: faker.lorem.paragraph(),
    paragraph_order: faker.number.int({ min: 1, max: 5 }),
  }

  describe('get /api/posts-paragraphs', () => {
    it('should get all posts-paragraphs', async () => {
      const res = await app.request('/api/posts-paragraphs')
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('posts_paragraphs')
    })
  })

  describe('get /api/posts-paragraphs/:id', () => {
    it('should get a post-paragraph', async () => {
      const res = await app.request('/api/posts-paragraphs/1') // Gunakan ID yang ada
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('post_paragraph')
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/posts-paragraphs/500') // ID yang tidak ada
      expect(res.status).toBe(404)
    })
  })

  describe('post /api/posts-paragraphs', () => {
    it('should create a new post paragraph', async () => {
      const res = await app.request('/api/posts-paragraphs', {
        method: 'POST',
        body: JSON.stringify(newPostParagraph),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'Created')
      createdPostParagraphId = body.post_paragraph.id
    })
  })

  describe('put /api/posts-paragraphs/:id', () => {
    it('should update a post paragraph', async () => {
      const res = await app.request(`/api/posts-paragraphs/${createdPostParagraphId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPostParagraph),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Updated')
      expect(body.post_paragraph).toMatchObject(updatedPostParagraph)
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/posts-paragraphs/9999', {
        method: 'PUT',
        body: JSON.stringify(updatedPostParagraph),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(404)
    })
  })

  describe('delete /api/posts-paragraphs/:id', () => {
    it('should delete a post paragraph', async () => {
      const res = await app.request(`/api/posts-paragraphs/${createdPostParagraphId}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body.post_paragraph).toMatchObject(updatedPostParagraph)
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/posts-paragraphs/9999', {
        method: 'DELETE',
      })
      expect(res.status).toBe(404)
    })
  })
})
