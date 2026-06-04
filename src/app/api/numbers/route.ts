import { NextRequest, NextResponse } from 'next/server'
import { getRequiredSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { reserveAndPurchaseNumber } from '@/lib/telnyx'
import { checkPlanLimit } from '@/lib/plan-guard'

export async function GET() {
  try {
    const user = await getRequiredSession()
    const numbers = await prisma.phoneNumber.findMany({
      where: { userId: user.id },
      include: { campaign: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ numbers })
  } catch (error: any) {
    return NextResponse.json({ numbers: [], error: error.message })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getRequiredSession()
    const { phoneNumber, manual } = await req.json()
    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
    }

    await checkPlanLimit(user.id, 'numbers')

    if (manual) {
      const number = await prisma.phoneNumber.create({
        data: {
          number: phoneNumber,
          telnyxId: 'manual_' + Date.now(),
          userId: user.id,
          status: 'active',
        },
      })
      return NextResponse.json({ number })
    }

    const result = await reserveAndPurchaseNumber(phoneNumber)
    const fullNumber = result.phoneNumber
    const telnyxId = result.order?.id || fullNumber
    const number = await prisma.phoneNumber.create({
      data: {
        number: fullNumber,
        telnyxId: String(telnyxId),
        userId: user.id,
      },
    })
    return NextResponse.json({ number })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
