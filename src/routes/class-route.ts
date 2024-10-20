import { Hono } from "hono"
import { prisma } from "../../prisma/db"
// import { Class } from "../db/schemas/class-schema"

const classRouter = new Hono()

classRouter
  .get('/', async (c) => {
    const classes = await prisma.classes.findMany()

    return c.json({
      classes
    })
  })
  .post('/', async (c) => {
    const {
      class_name,
      teacher_id,
    } = await c.req.json()

    await prisma.classes.create({
      data: {
        class_name,
      }
    })

    return c.json({ message: "success" })
  })

export default classRouter
