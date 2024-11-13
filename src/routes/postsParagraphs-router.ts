import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'

const postsParagraphsRouter = new Hono()

postsParagraphsRouter
  .get('/', async (c) => {
    const postsParagraphs = await prisma.posts_paragraphs.findMany()

    return c.json({
      posts_paragraphs: postsParagraphs,
    })
  })

  .get('/:id', async (c) => {
    const id = c.req.param('id')

    const postParagraph = await prisma.posts_paragraphs.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!postParagraph) {
      return c.json({
        message: 'Post Paragraph not found',
      }, 404)
    }

    return c.json({
      post_paragraph: postParagraph,
    })
  })

  .post('/', async (c) => {
    const {
      content,
      paragraph_order,
      post_id,
    } = await c.req.json()

    const postParagraph = await prisma.posts_paragraphs.create({
      data: {
        content,
        paragraph_order,
        post_id,
      },
    })

    return c.json({
      message: 'Created',
      post_paragraph: postParagraph,
    })
  })

  .put('/:id', async (c) => {
    const id = c.req.param('id')

    const {
      content,
      paragraph_order,
    } = await c.req.json()

    let postParagraph = await prisma.posts_paragraphs.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!postParagraph) {
      return c.json({
        message: 'Post Paragraph not found',
      }, 404)
    }

    postParagraph = await prisma.posts_paragraphs.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        content,
        paragraph_order,
      },
    })

    return c.json({
      message: 'Updated',
      post_paragraph: postParagraph,
    })
  })

  .delete('/:id', async (c) => {
    const id = c.req.param('id')

    let postParagraph = await prisma.posts_paragraphs.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!postParagraph) {
      return c.json({
        message: 'Post Paragraph not found',
      }, 404)
    }

    postParagraph = await prisma.posts_paragraphs.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({
      message: 'Deleted',
      post_paragraph: postParagraph,
    })
  })

export default postsParagraphsRouter
