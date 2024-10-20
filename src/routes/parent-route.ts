import { Hono } from "hono"
import { prisma } from "../../prisma/db"
// import { Parent } from "../db/schemas/parent-schema"

const parentRouter = new Hono()

parentRouter
  .get('/', async (c) => {
    const parents = await prisma.parents.findMany()

    return c.json({ parents })
  })
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
  .get('/:id', async (c) => {
    const { id } = c.req.param()

    // const parent = await Parent.findById(id)
    const parent = await prisma.parents.findUnique({
      where: {
        id: Number.parseInt(id),
      }
    })

    return c.json({ parent })
  })

export default parentRouter
