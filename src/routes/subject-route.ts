import { Hono } from "hono"
// import { Subject } from "../db/schemas/subject-schema"

const subjectRouter = new Hono()

subjectRouter
  .get('/', async (c) => {
    // const subject = await Subject.find()
    // return c.json(subject)
  })
  .post('/', async (c) => {
    const {
      subject_name,
      grade
    } = await c.req.json()

    // await Subject.create({
    //   subject_name,
    //   grade
    // })

    return c.json({ success: true })
  })

export default subjectRouter
