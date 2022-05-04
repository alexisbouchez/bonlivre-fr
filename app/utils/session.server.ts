import { createCookieSessionStorage, redirect } from 'remix'
import { db } from './db.server'

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'BL_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'))
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') return null
  return userId
}

export async function requireUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') {
    throw redirect(`/sign-in`)
  }
  return userId
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request)
  const user = await db.user.findFirst({ where: { id: userId } })
  if (!user) {
    throw redirect(`/sign-in`)
  }
  return user
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

export async function getUserById(userId: string) {
  return db.user.findFirst({ where: { id: userId } })
}

export async function getUser(request: Request) {
  const userId = await getUserId(request)
  if (typeof userId !== 'string') {
    return null
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    })
    return user
  } catch (err) {
    throw signOut(request)
  }
}

export async function signOut(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'))
  return redirect('/sign-in', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}
