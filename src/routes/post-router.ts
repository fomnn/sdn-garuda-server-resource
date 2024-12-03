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
    const formData = await c.req.formData()

    const image = formData.get('image') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (image) {
      const formData2 = new FormData()

      formData2.set('image', image)

      const res = await fetch('http://localhost:3005/api/images/posts/upload', {
        method: 'POST',
        body: formData2,
      })
      const {
        imageUrl,
      }: {
        message: string
        imageUrl: string
      } = await res.json()

      const post = await prisma.posts.create({
        data: {
          title,
          description,
          image_url: imageUrl,
        },
      })


      return c.json({
        message: 'Created',
        post,
      }) 
    }

    const post = await prisma.posts.create({
      data: {
        title,
        description,
      },
    })

    return c.json({
      message: 'Created',
      post,
    })
  })

  .put('/:id', async (c) => {
    const id = c.req.param('id')

    const formdata = await c.req.formData()

    const image = formdata.get('image') as File
    const title = formdata.get('title') as string
    const description = formdata.get('description') as string

    let post = await prisma.posts.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!post) {
      return c.json({
        message: 'Post not found',
      }, 404)
    }

    if (image) {
      const formData2 = new FormData()

      formData2.set('image', image)

      const res = await fetch('http://localhost:3005/api/images/posts/upload', {
        method: 'POST',
        body: formData2,
      })
      const {
        imageUrl,
      }: {
        message: string
        imageUrl: string
      } = await res.json()

      post = await prisma.posts.update({
        where: {
          id: Number.parseInt(id),
        },
        data: {
          title,
          description,
          image_url: imageUrl,
        },
      })
    } else {
      post = await prisma.posts.update({
        where: {
          id: Number.parseInt(id),
        },
        data: {
          title,
          description,
        },
      })
    }

    return c.json({
      message: 'Updated',
      post,
    })
  })

  .delete('/:id', async (c) => {
    const id = c.req.param('id')

    let post = await prisma.posts.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!post) {
      return c.json({
        message: 'Post not found',
      }, 404)
    }

    post = await prisma.posts.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({
      message: 'Deleted',
      post,
    })
  })

export default postRouter
