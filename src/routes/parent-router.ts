import { Hono } from "hono"
import { prisma } from "@/prisma/db"
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
      }
    })

    return c.json({ parent })
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
    } = await c.req.parseBody() as Record<string, string>

    await prisma.parents.create({
      data: {
        nama,
        jenjang_pendidikan,
        NIK,
        pekerjaan,
        penghasilan,
        tahun_lahir: Number.parseInt(tahun_lahir),
      }
    })

    return c.json({ success: true })
  })

  // DELETE /api/parents/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')
    const parent = await prisma.parents.delete({
      where: {
        id: Number.parseInt(id),
      }
    })

    return c.json({ parent })
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
      penggayahan,
    } = await c.req.parseBody() as Record<string, string>

    const parent = await prisma.parents.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        nama,
        jenjang_pendidikan,
        NIK,
        pekerjaan,
        tahun_lahir: Number.parseInt(tahun_lahir),
      }
    })

    return c.json({ parent })
  })

export default parentRouter
