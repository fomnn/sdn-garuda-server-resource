import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'
// import { Parent } from "../db/schemas/parent-schema"

const parentRouter = new Hono()

parentRouter
  // GET /api/parents
  .get('/', async (c) => {
    const parents = await prisma.parents.findMany()

    return c.json({ parents })
  })
  // GET /api/parents/:id
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const parent = await prisma.parents.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })

    const students = await prisma.students.findMany({
      where: {
        parents_students: {
          some: {
            parent_id: Number.parseInt(id),
          },
        },
      },
    })

    if (!parent) {
      return c.json({ message: 'Parent not found' }, 400)
    }

    return c.json({ parent, students })
  })

  // POST /api/parents
  .post('/', async (c) => {
    const {
      nama,
      jenjang_pendidikan,
      NIK,
      pekerjaan,
      tahun_lahir,
      penghasilan,
      email
    } = await c.req.json()

    const parent = await prisma.parents.create({
      data: {
        nama,
        jenjang_pendidikan,
        NIK,
        pekerjaan,
        email,
        penghasilan,
        tahun_lahir: Number.parseInt(tahun_lahir),
      },
    })

    return c.json({ message: 'success', parent })
  })

  // DELETE /api/parents/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')

    const parent = await prisma.parents.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!parent) {
      return c.json({ message: 'Parent not found' }, 400)
    }

    await prisma.parents.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({ message: 'success', parent })
  })

  // PUT /api/parents/:id
  .put('/:id', async (c) => {
    const id = c.req.param('id')
    const {
      nama,
      jenjang_pendidikan,
      NIK,
      pekerjaan,
      tahun_lahir,
      penghasilan,
      email
    } = await c.req.json()

    const parent = await prisma.parents.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!parent) {
      return c.json({
        message: 'Parent not found',
      }, 400)
    }

    await prisma.parents.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        nama,
        jenjang_pendidikan,
        NIK,
        email,
        pekerjaan,
        tahun_lahir: Number.parseInt(tahun_lahir),
        penghasilan,
      },
    })

    return c.json({ message: 'success', parent })
  })

export default parentRouter
