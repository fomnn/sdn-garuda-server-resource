import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'

const postRouter = new Hono()

postRouter
  .get('/', async (c) => {
    const posts = await prisma.posts.findMany()

    return c.json({ posts })
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id')

    const post = await prisma.posts.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!post) {
      return c.json({
        message: 'Post not found',
      }, 404)
    }

    return c.json({
      post,
    })
  })
  .post('/', async (c) => {
    const {
      title,
      image_path,
    } = await c.req.json()

    await prisma.posts.create({
      data: {
        title,
        image_path,
      },
    })

    return c.json({
      message: 'Created',
    })
  })

  .put('/:id', async (c) => {
    const id = c.req.param('id')

    const {
      title,
      image_path,
    } = await c.req.json()

    const post = await prisma.posts.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!post) {
      return c.json({
        message: 'Post not found',
      }, 404)
    }

    await prisma.posts.update({
      data: {
        title,
        image_path,
      },
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({
      message: 'Updated',
    })
  })

  .delete('/:id', async (c) => {
    const id = c.req.param('id')

    const post = await prisma.posts.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!post) {
      return c.json({
        message: 'Post not found',
      }, 404)
    }

    await prisma.posts.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({
      message: 'Deleted',
    })
  })
