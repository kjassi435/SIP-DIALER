import { prisma } from './prisma'

export interface BlockResult {
  blocked: boolean
  reason?: string
}

export async function checkVoipBlock(callerNumber: string): Promise<BlockResult> {
  const recentCalls = await prisma.call.findMany({
    where: { callerNumber, createdAt: { gte: new Date(Date.now() - 3600000) } },
    orderBy: { createdAt: 'desc' },
  })
  if (recentCalls.length > 20) {
    return { blocked: true, reason: 'Rate limit exceeded' }
  }
  return { blocked: false }
}

export async function checkCallerIdBlock(
  callerNumber: string,
  userId: string
): Promise<BlockResult> {
  const blocked = await prisma.call.findFirst({
    where: { callerNumber, phoneNumber: { userId }, status: 'blocked_callerid' },
  })
  if (blocked) return { blocked: true, reason: 'Caller ID is blocked' }
  return { blocked: false }
}

export async function checkDuplicate(
  callerNumber: string,
  campaignId: string
): Promise<{ isDuplicate: boolean; originalCallId?: string }> {
  const existing = await prisma.call.findFirst({
    where: { callerNumber, phoneNumber: { campaignId } },
    orderBy: { createdAt: 'desc' },
  })
  if (existing) {
    return { isDuplicate: true, originalCallId: existing.id }
  }
  return { isDuplicate: false }
}
