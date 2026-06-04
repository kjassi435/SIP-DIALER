import { NextRequest, NextResponse } from 'next/server'
import { getRequiredSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PLANS } from '@/lib/plans'

export async function GET() {
  try {
    const user = await getRequiredSession()
    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, name: true, role: true, plan: true, createdAt: true,
        _count: { select: { phoneNumbers: true, campaigns: true, callRoutes: true, ivrMenus: true } },
      },
    })
    return NextResponse.json({ users })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getRequiredSession()
    if (admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const { userId, plan, role } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const data: any = {}
    if (plan && PLANS[plan as keyof typeof PLANS]) data.plan = plan
    if (role && ['SUPER_ADMIN', 'USER'].includes(role)) data.role = role

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, role: true, plan: true },
    })
    return NextResponse.json({ user: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
