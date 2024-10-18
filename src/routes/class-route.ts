import { Hono } from "hono"
// import { Class } from "../db/schemas/class-schema"

const classRouter = new Hono()

classRouter.get('/', async (c) => {
  // const class2 = await Class.find()
  // return c.json(class2)
})

classRouter.post('/', async (c) => {

  const {
    class_name,
    teacher_id,
  } = await c.req.json()

  // await Class.create({
  //   class_name,
  //   teacher_id,
  //   students: []
  // })

  return c.json({ message: "success" })
})

export default classRouter
