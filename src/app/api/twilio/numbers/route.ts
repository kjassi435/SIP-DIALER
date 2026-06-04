import { NextRequest, NextResponse } from 'next/server'
import { getRequiredSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { searchAvailableNumbers, purchaseNumber, listPurchasedNumbers, releaseNumber } from '@/lib/twilio'
import { checkPlanLimit } from '@/lib/plan-guard'

export async function GET() {
  try {
    const user = await getRequiredSession()
    const twilioNumbers = await listPurchasedNumbers()
    const dbNumbers = await prisma.phoneNumber.findMany({
      where: { userId: user.id, telnyxId: { startsWith: 'tw_' } },
      include: { campaign: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    const synced = twilioNumbers.map(tn => {
      const existing = dbNumbers.find(d => d.telnyxId === tn.sid)
      return {
        sid: tn.sid,
        phoneNumber: tn.phoneNumber,
        friendlyName: tn.friendlyName,
        campaignName: existing?.campaign?.name || null,
        campaignId: existing?.campaignId || null,
        status: existing?.status || 'active',
      }
    })
    return NextResponse.json({ numbers: synced })
  } catch (error: any) {
    return NextResponse.json({ numbers: [], error: error.message })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getRequiredSession()
    const { phoneNumber } = await req.json()
    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
    }

    await checkPlanLimit(user.id, 'numbers')

    const result = await purchaseNumber(phoneNumber)

    const number = await prisma.phoneNumber.create({
      data: {
        number: result.phoneNumber,
        telnyxId: 'tw_' + result.sid,
        userId: user.id,
        status: 'active',
      },
    })
    return NextResponse.json({ number: { ...number, sid: result.sid } })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getRequiredSession()
    const { sid, campaignId } = await req.json()
    const number = await prisma.phoneNumber.findFirst({
      where: { telnyxId: 'tw_' + sid, userId: user.id },
    })
    if (!number) return NextResponse.json({ error: 'Number not found' }, { status: 404 })
    const updated = await prisma.phoneNumber.update({
      where: { id: number.id },
      data: { campaignId: campaignId || null },
    })
    return NextResponse.json({ number: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getRequiredSession()
    const { sid } = await req.json()
    await releaseNumber(sid)
    await prisma.phoneNumber.deleteMany({
      where: { telnyxId: 'tw_' + sid, userId: user.id },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
