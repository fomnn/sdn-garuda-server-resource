import type { posts } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import app from '../src/app.js'

let createdPostId: number
type Post = Omit<posts, 'id' | 'created_at' | 'updated_at'>

describe('post API tests', () => {
  const newPost: Post = {
    title: faker.lorem.words(3),
    image_path: faker.system.filePath(),
  }
  const updatedPost: Post = {
    title: faker.lorem.words(3),
    image_path: faker.system.filePath(),
  }

  describe('get /api/posts', () => {
    it('should get all posts', async () => {
      const res = await app.request('/api/posts')
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('posts')
    })
  })

  describe('get /api/posts/:id', () => {
    it('should get a post', async () => {
      const res = await app.request('/api/posts/1') // Gunakan ID yang ada
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('post')
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/posts/500') // ID yang tidak ada
      expect(res.status).toBe(404)
    })
  })

  describe('post /api/posts', () => {
    it('should create a new post', async () => {
      const res = await app.request('/api/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'Created')
      createdPostId = body.post.id
    })
  })

  describe('put /api/posts/:id', () => {
    it('should update a post', async () => {
      const res = await app.request(`/api/posts/${createdPostId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPost),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Updated')
      expect(body.post).toMatchObject(updatedPost)
    })

    it('should throw an error 404 if post not found', async () => {
      const res = await app.request('/api/posts/9999', {
        method: 'PUT',
        body: JSON.stringify(updatedPost),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(404)
    })
  })

  describe('delete /api/posts/:id', () => {
    it('should delete a post', async () => {
      const res = await app.request(`/api/posts/${createdPostId}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
      expect(body.post).toMatchObject(updatedPost)
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/posts/9999', {
        method: 'DELETE',
      })
      expect(res.status).toBe(404)
    })
  })
})
