import { Hono } from "hono";
import { prisma } from "./../prisma/db.js";

const feedbackRouter = new Hono()

feedbackRouter
  // GET /api/feedback
  .get('/', async (c) => {
    const feedback = await prisma.feedbacks.findMany()

    return c.json({ feedback })
  })

  // GET /api/feedback/:id
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const feedback = await prisma.feedbacks.findUnique({
      where: {
        id: Number.parseInt(id),
      }
    })

    return c.json({ feedback })
  })

  // POST /api/feedback
  .post('/', async (c) => {
    const {
      feedback_text,
      rating,
      date,
      teacher_id,
      parent_id
    } = await c.req.json()

    const feedback = await prisma.feedbacks.create({
      data: {
        feedback_text,
        rating,
        date,
        teacher_id,
        parent_id,
      }
    })
    return c.json({ feedback })
  })

  // PUT /api/feedback/:id
  .put('/:id', async (c) => {
    const id = c.req.param('id')
    const {
      feedback_text,
      rating,
      date,
      teacher_id,
      parent_id
    } = await c.req.json()

    const feedback = await prisma.feedbacks.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        feedback_text,
        rating,
        date,
        teacher_id,
        parent_id
      }
    })

    return c.json({ feedback })
  })

  // DELETE /api/feedback/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')
    const feedback = await prisma.feedbacks.delete({
      where: {
        id: Number.parseInt(id),
      }
    })

    return c.json({ feedback })
  })

export default feedbackRouter
