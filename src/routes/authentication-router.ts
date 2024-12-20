import type { JwtVariables } from 'hono/jwt'
import { Hono } from 'hono'
import { jwt, sign } from 'hono/jwt'
import { prisma } from '../../prisma/db.js'

type Variables = JwtVariables

const authenticationRouter = new Hono<{ Variables: Variables }>()

authenticationRouter
  .use('/verify', jwt({
    secret: 'secret',
  }))
  .use('/superadmin/verify', jwt({
    secret: 'secret',
  }))

  .post('/login', async (c) => {
    const {
      email,
      password,
      role,
    } = await c.req.json()

    const jwtSecret = 'secret'
    if (!['parent', 'teacher', 'principal'].includes(role)) {
      return c.json({
        message: `There is no role ${role}!`,
      }, 404)
    }

    // mengambil data dari table account
    const account = await prisma.accounts.findUnique({
      where: {
        email,
        type: role,
      },
    })

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5

    if (!account) {
      if (role === 'teacher') {
        const teacher = await prisma.teachers.findUnique({
          where: {
            email,
          },
        })

        if (!teacher) {
          return c.json({
            message: 'Teacher not found',
          }, 404)
        }

        const account = await prisma.accounts.create({
          data: {
            email,
            password,
            type: 'teacher',
            user_id: teacher.id,
          },
        })

        const payload = {
          account_id: account.id,
          role: account.type,
          exp, // Token expires in 5 minutes
        }

        const token = await sign(payload, jwtSecret)

        return c.json({
          account,
          token,
          message: 'Login success',
        })
      }
      else if (role === 'parent') {
        const parent = await prisma.parents.findUnique({
          where: {
            email,
          },
        })

        if (!parent) {
          return c.json({
            message: 'Parent not found',
          }, 404)
        }

        const account = await prisma.accounts.create({
          data: {
            email,
            password,
            type: 'parent',
            user_id: parent.id,
          },
        })

        const payload = {
          account_id: account.id,
          role: account.type,
          exp, // Token expires in 5 minutes
        }

        const token = await sign(payload, jwtSecret)

        return c.json({
          account,
          token,
          message: 'Login success',
        })
      }
      else {
        const principal = await prisma.principals.findUnique({
          where: {
            email,
          },
        })

        if (!principal) {
          return c.json({
            message: 'Principal not found',
          }, 404)
        }

        const account = await prisma.accounts.create({
          data: {
            email,
            password,
            type: 'parent',
            user_id: principal.id,
          },
        })

        const payload = {
          account_id: account.id,
          role: account.type,
          exp, // Token expires in 5 minutes
        }

        const token = await sign(payload, jwtSecret)

        return c.json({
          account,
          token,
          message: 'Login success',
        })
      }
    }

    if (account.password !== password) {
      return c.json({
        message: 'Wrong password',
      }, 404)
    }

    if (account.type === 'teacher') {
      const teacher = await prisma.teachers.findFirst({
        where: {
          email,
        },
      })

      const payload = {
        account_id: account.id,
        role: account.type,
        exp, // Token expires in 5 minutes
      }

      const token = await sign(payload, jwtSecret)

      return c.json({
        teacher,
        token,
        message: 'Login success',
      })
    }
    else if (account.type === 'parent') {
      const parent = await prisma.parents.findFirst({
        where: {
          email,
        },
      })

      const payload = {
        account_id: account.id,
        role: account.type,
        exp, // Token expires in 5 minutes
      }

      const token = await sign(payload, jwtSecret)

      return c.json({
        parent,
        token,
        message: 'Login success',
      })
    }
  })

  .post('/superadmin/login', async (c) => {
    const {
      username,
      password,
    } = await c.req.json()
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5
    const jwtSecret = 'secret'

    const superadmin = await prisma.superadmin.findFirst({
      where: {
        username,
        password,
      },
    })

    if (!superadmin) {
      return c.json({
        message: 'username or password is incorrect',
      }, 400)
    }

    const payload = {
      superadmin_id: superadmin.id,
      exp, // Token expires in 5 minutes
    }

    const token = await sign(payload, jwtSecret)

    return c.json({
      superadmin,
      token,
      message: 'Login as superadmin success',
    })
  })

  .post('/verify', async (c) => {
    const { account_id } = c.get('jwtPayload')
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5
    const account = await prisma.accounts.findFirst({
      where: {
        id: account_id,
      },
    })

    if (!account) {
      // only for typescript
      return
    }

    const newPayload = {
      account_id: account.id,
      role: account.type,
      exp,
    }
    const jwtSecret = 'secret'

    const token = await sign(newPayload, jwtSecret)

    if (account.type === 'parent') {
      const parent = await prisma.parents.findFirst({
        where: {
          id: account.user_id,
        },
      })
      return c.json({
        parent,
        token,
      })
    }
    else {
      const teacher = await prisma.teachers.findFirst({
        where: {
          id: account.user_id,
        },
      })
      return c.json({
        teacher,
        token,
      })
    }
  })

  .post('/superadmin/verify', async (c) => {
    const { superadmin_id } = c.get('jwtPayload')

    const superadmin = await prisma.superadmin.findFirst({
      where: {
        id: superadmin_id,
      },
    })

    return c.json({
      superadmin,
    })
  })

export default authenticationRouter
