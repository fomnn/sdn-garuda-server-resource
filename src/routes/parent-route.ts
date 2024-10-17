import { Hono } from "hono"
import { Parent } from "../db/schemas/parent-schema"

const parentRouter = new Hono()

parentRouter.get('/', async (c) => {
  const parent = await Parent.find()
  return c.json(parent)
})

parentRouter.post('/', async (c) => {
  const {
    first_name,
    middle_name,
    last_name,
    contact_number,
    email,
    address,
    gender,
    occupation,
  } = await c.req.parseBody() as Record<string, string>

  await Parent.create({
    first_name,
    middle_name,
    last_name,
    contact_number,
    email,
    address,
    gender,
    occupation,
    dependents: [
      {
        student_id: 'fasdfadsf',
        relationship: 'father'
      }
    ]
  })

  return c.json({ success: true })
})

parentRouter.get('/:id', async (c) => {
  const { id } = c.req.param()

  const parent = await Parent.findById(id)

  return c.json(parent)
})

export default parentRouter