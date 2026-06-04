import { NextResponse } from 'next/server'
import { getRequiredSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getRequiredSession()
    const calls = await prisma.call.findMany({
      where: { phoneNumber: { userId: user.id } },
      include: { phoneNumber: { select: { number: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ calls })
  } catch (error: any) {
    return NextResponse.json({ calls: [], error: error.message })
  }
}
