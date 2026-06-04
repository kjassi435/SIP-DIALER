import { NextRequest, NextResponse } from 'next/server'
import { getRequiredSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { releaseNumber } from '@/lib/telnyx'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getRequiredSession()
    const number = await prisma.phoneNumber.findFirst({
      where: { id: params.id, userId: user.id },
    })
    if (!number) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await releaseNumber(number.telnyxId)
    await prisma.phoneNumber.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getRequiredSession()
    const body = await req.json()
    const number = await prisma.phoneNumber.findFirst({
      where: { id: params.id, userId: user.id },
    })
    if (!number) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = await prisma.phoneNumber.update({
      where: { id: params.id },
      data: { campaignId: body.campaignId || null },
    })
    return NextResponse.json({ number: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
