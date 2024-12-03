import type { posts } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { ofetch } from 'ofetch'
import { beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../prisma/db.js'
import app from '../src/app.js'

interface Post { image: File, title: string, description: string }

let postIds: number[]
let newPost: Post
let newPostFormData: FormData
let updatedPost: Post
let updatedPostFormData: FormData

beforeAll(async () => {
  const posts = await prisma.posts.findMany()
  postIds = posts.map(postData => postData.id)

  // const req = new Request(faker.image.urlLoremFlickr())
  const image = await ofetch<File>(faker.image.urlLoremFlickr())

  newPost = {
    title: faker.lorem.words(3),
    image,
    description: faker.lorem.paragraph(),
  }

  newPostFormData = new FormData()
  newPostFormData.append('image', image)
  newPostFormData.append('title', newPost.title)
  newPostFormData.append('description', newPost.description)

  updatedPost = {
    title: faker.lorem.words(3),
    image,
    description: faker.lorem.paragraph(),
  }

  updatedPostFormData = new FormData()
  updatedPostFormData.append('image', image)
  updatedPostFormData.append('title', updatedPost.title)
  updatedPostFormData.append('description', updatedPost.description)
})

describe('post API tests', () => {
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
      const res = await app.request(`/api/posts/${faker.helpers.arrayElement(postIds)}`) // Gunakan ID yang ada
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
        body: newPostFormData,
        // headers: new Headers({ 'Content-Type': 'multipart/form-data' }),
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveProperty('message', 'Created')
    })
  })

  describe('put /api/posts/:id', () => {
    it('should update a post', async () => {
      const res = await app.request(`/api/posts/${faker.helpers.arrayElement(postIds)}`, {
        method: 'PUT',
        body: updatedPostFormData,
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Updated')
      expect(body).toHaveProperty('post')
    })

    it('should throw an error 404 if post not found', async () => {
      const res = await app.request('/api/posts/9999', {
        method: 'PUT',
        body: updatedPostFormData,
      })

      expect(res.status).toBe(404)
    })
  })

  describe('delete /api/posts/:id', () => {
    it('should delete a post', async () => {
      const res = await app.request(`/api/posts/${faker.helpers.arrayElement(postIds)}`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toHaveProperty('message', 'Deleted')
    })

    it('should throw an error 404 if not found', async () => {
      const res = await app.request('/api/posts/9999', {
        method: 'DELETE',
      })
      expect(res.status).toBe(404)
    })
  })
})
