import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'

const feedbackRouter = new Hono()

feedbackRouter
  // GET /api/feedback
  .get('/', async (c) => {
    const feedbacks = await prisma.feedbacks.findMany()

    return c.json({ feedbacks })
  })

  // GET /api/feedback/:id
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const feedback = await prisma.feedbacks.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!feedback) {
      return c.json({
        message: 'Feedback not found',
      }, 404)
    }

    return c.json({ feedback })
  })

  // POST /api/feedback
  .post('/', async (c) => {
    const {
      feedback_text,
      rating,
      date,
      teacher_id,
      parent_id,
    } = await c.req.json()

    const feedback = await prisma.feedbacks.create({
      data: {
        feedback_text,
        rating,
        date,
        teacher_id,
        parent_id,
      },
    })

    return c.json({
      message: 'Created',
      feedback,
    })
  })

  // PUT /api/feedback/:id
  .put('/:id', async (c) => {
    const id = c.req.param('id')
    const {
      feedback_text,
      rating,
      date,
      teacher_id,
      parent_id,
    } = await c.req.json()

    let feedback = await prisma.feedbacks.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!feedback) {
      return c.json({
        message: 'Feedback not found',
      }, 404)
    }
    feedback = await prisma.feedbacks.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        feedback_text,
        rating,
        date,
        teacher_id,
        parent_id,
      },
    })

    return c.json({
      message: 'Updated',
      feedback,
    })
  })

  // DELETE /api/feedback/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')
    let feedback = await prisma.feedbacks.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!feedback) {
      return c.json({
        message: 'Feedback not found',
      }, 404)
    }

    feedback = await prisma.feedbacks.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({
      message: 'Deleted',
      feedback,
    })
  })

export default feedbackRouter
