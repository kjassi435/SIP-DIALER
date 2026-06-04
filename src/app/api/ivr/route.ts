import { NextRequest, NextResponse } from 'next/server'
import { getRequiredSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkPlanLimit } from '@/lib/plan-guard'

export async function GET() {
  try {
    const user = await getRequiredSession()
    const menus = await prisma.ivrMenu.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ menus })
  } catch (error: any) {
    return NextResponse.json({ menus: [], error: error.message })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getRequiredSession()
    await checkPlanLimit(user.id, 'ivrMenus')
    const data = await req.json()
    const menu = await prisma.ivrMenu.create({
      data: {
        name: data.name, greeting: data.greeting,
        options: JSON.stringify(data.options || []), timeout: data.timeout || 10, userId: user.id,
      },
    })
    return NextResponse.json({ menu })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getRequiredSession()
    const data = await req.json()
    const menu = await prisma.ivrMenu.findFirst({
      where: { id: data.id, userId: user.id },
    })
    if (!menu) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = await prisma.ivrMenu.update({
      where: { id: data.id },
      data: {
        name: data.name, greeting: data.greeting,
        options: JSON.stringify(data.options || []), timeout: data.timeout, enabled: data.enabled,
      },
    })
    return NextResponse.json({ menu: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
