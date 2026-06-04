import { NextRequest, NextResponse } from 'next/server'
import { getRequiredSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkPlanLimit } from '@/lib/plan-guard'

export async function GET() {
  try {
    const user = await getRequiredSession()
    const campaigns = await prisma.campaign.findMany({
      where: { userId: user.id },
      include: {
        phoneNumbers: true,
        callRoutes: { where: { enabled: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ campaigns })
  } catch (error: any) {
    return NextResponse.json({ campaigns: [], error: error.message })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getRequiredSession()
    await checkPlanLimit(user.id, 'campaigns')
    const { name } = await req.json()
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
    const campaign = await prisma.campaign.create({
      data: { name, userId: user.id },
    })
    return NextResponse.json({ campaign })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
