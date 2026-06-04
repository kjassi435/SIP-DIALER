import { NextRequest, NextResponse } from 'next/server'
import { getRequiredSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkPlanLimit } from '@/lib/plan-guard'

export async function GET() {
  try {
    const user = await getRequiredSession()
    const routes = await prisma.callRoute.findMany({
      where: { userId: user.id },
      include: { campaign: { select: { name: true } } },
      orderBy: [{ priority: 'asc' }, { weight: 'desc' }],
    })
    return NextResponse.json({ routes })
  } catch (error: any) {
    return NextResponse.json({ routes: [], error: error.message })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getRequiredSession()
    await checkPlanLimit(user.id, 'routes')
    const data = await req.json()
    const route = await prisma.callRoute.create({
      data: { ...data, userId: user.id },
    })
    return NextResponse.json({ route })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getRequiredSession()
    const data = await req.json()
    const route = await prisma.callRoute.findFirst({
      where: { id: data.id, userId: user.id },
    })
    if (!route) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = await prisma.callRoute.update({
      where: { id: data.id },
      data: {
        name: data.name, priority: data.priority, weight: data.weight,
        destination: data.destination, destinationType: data.destinationType,
        enabled: data.enabled, timeFrom: data.timeFrom, timeTo: data.timeTo, campaignId: data.campaignId,
      },
    })
    return NextResponse.json({ route: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getRequiredSession()
    const { id } = await req.json()
    const route = await prisma.callRoute.findFirst({
      where: { id, userId: user.id },
    })
    if (!route) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await prisma.callRoute.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
