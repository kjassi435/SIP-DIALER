import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkVoipBlock, checkCallerIdBlock, checkDuplicate } from '@/lib/blocking'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data, event_type } = body

    if (!data || !data.payload) {
      return NextResponse.json({ success: true })
    }

    const callPayload = data.payload
    const callerNumber = callPayload.from || ''
    const calledNumber = callPayload.to || ''
    const telnyxCallId = callPayload.call_control_id || data.id || ''

    if (!telnyxCallId) {
      return NextResponse.json({ success: true })
    }

    const phoneNumber = await prisma.phoneNumber.findFirst({
      where: { number: calledNumber },
      include: { campaign: { include: { callRoutes: { where: { enabled: true }, orderBy: [{ priority: 'asc' }, { weight: 'desc' }] } } } },
    })

    if (event_type === 'call.initiated' || event_type === 'call.incoming') {
      const voipBlock = await checkVoipBlock(callerNumber)
      if (voipBlock.blocked) {
        await prisma.call.create({
          data: {
            telnyxCallId,
            callerNumber,
            calledNumber,
            direction: 'inbound',
            status: 'blocked_voip',
            voipBlocked: true,
            phoneNumberId: phoneNumber?.id,
          },
        })
        return NextResponse.json({ success: true })
      }

      if (phoneNumber?.campaignId) {
        const callerBlock = await checkCallerIdBlock(callerNumber, phoneNumber.userId)
        if (callerBlock.blocked) {
          await prisma.call.create({
            data: {
              telnyxCallId,
              callerNumber,
              calledNumber,
              direction: 'inbound',
              status: 'blocked_callerid',
              phoneNumberId: phoneNumber.id,
            },
          })
          return NextResponse.json({ success: true })
        }

        const duplicate = await checkDuplicate(callerNumber, phoneNumber.campaignId)
        if (duplicate.isDuplicate) {
          const route = phoneNumber.campaign?.callRoutes.find(r => r.destinationType === 'number')
          if (route) {
            await prisma.call.create({
              data: {
                telnyxCallId,
                callerNumber: callerNumber,
                calledNumber,
                direction: 'inbound',
                status: 'routed',
                tags: 'duplicate',
                phoneNumberId: phoneNumber.id,
              },
            })
          }
        }
      }

      await prisma.call.create({
        data: {
          telnyxCallId,
          callerNumber: callerNumber,
          calledNumber,
          direction: 'inbound',
          status: 'ringing',
          phoneNumberId: phoneNumber?.id,
        },
      })
    }

    if (event_type === 'call.completed') {
      const duration = callPayload.duration || 0
      await prisma.call.updateMany({
        where: { telnyxCallId },
        data: { status: 'completed', duration },
      })
    }

    if (event_type === 'call.recording.saved') {
      const recordingUrl = callPayload.recording_urls?.mp3 || callPayload.recording_urls?.wav || ''
      await prisma.call.updateMany({
        where: { telnyxCallId },
        data: { recordingUrl },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ success: true })
  }
}
