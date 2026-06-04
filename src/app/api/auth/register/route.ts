import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }
    const hashed = await hashPassword(password)
    const user = await prisma.user.create({
      data: { email, password: hashed, name: name || email.split('@')[0], plan: 'FREE' },
    })
    const token = createToken({ id: user.id, email: user.email })
    const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } })
    res.cookies.set('token', token, { httpOnly: true, secure: false, sameSite: 'lax', path: '/', maxAge: 604800 })
    return res
  } catch (e) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
