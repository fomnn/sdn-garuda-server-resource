import { Hono } from "hono"
// import { Teacher } from "../db/schemas/teacher-schema"

const teacherRouter = new Hono()

teacherRouter.get('/', async (c) => {
  // const teacher = await Teacher.find()
  // return c.json(teacher)
})

teacherRouter.post('/', async (c) => {
  const {
    first_name,
    middle_name,
    last_name,
    email,
    role,
    gender,
    contact_number
  } = await c.req.json()

  // await Teacher.create({
  //   first_name,
  //   middle_name,
  //   last_name,
  //   email,
  //   role,
  //   gender,
  //   contact_number,
  // })

  return c.json({ message: "success" })
})
export default teacherRouter
