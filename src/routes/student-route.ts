import { Hono } from "hono"
// import { Student } from "../db/schemas/student-schema"

const studentRouter = new Hono()

studentRouter
  .get('/', async (c) => {
    // const student = await Student.find()
    // return c.json(student)
  })
  .post('/', async (c) => {
    const {
      first_name,
      middle_name,
      last_name,
      birth_date,
      gender,
      // address,
      parent_id,
      // grade,
      class_id,
    } = await c.req.json() as Record<string, string> & {
      gender: "male" | "female",
    }

    return c.text('Success', 200)
  })



export default studentRouter
