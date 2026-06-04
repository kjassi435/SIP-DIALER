import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateTwiML } from '@/lib/twilio'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const calledNumber = formData.get('To') as string
    const callerNumber = formData.get('From') as string
    const callSid = formData.get('CallSid') as string

    const phoneNumber = await prisma.phoneNumber.findFirst({
      where: { number: calledNumber },
      include: {
        campaign: {
          include: {
            callRoutes: { where: { enabled: true }, orderBy: [{ priority: 'asc' }, { weight: 'desc' }] },
          },
        },
      },
    })

    await prisma.call.create({
      data: {
        telnyxCallId: callSid,
        phoneNumberId: phoneNumber?.id,
        callerNumber,
        calledNumber,
        direction: 'inbound',
        status: 'ringing',
      },
    })

    if (!phoneNumber?.campaign) {
      const twiml = generateTwiML({})
      return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } })
    }

    const ivrMenu = await prisma.ivrMenu.findFirst({
      where: { userId: phoneNumber.campaign.userId, enabled: true },
    })

    if (ivrMenu) {
      const options = JSON.parse(ivrMenu.options || '[]')
      const twiml = generateTwiML({
        greeting: ivrMenu.greeting || undefined,
        options: options.length > 0 ? options.map((o: any) => ({
          digit: o.digit, text: o.text, destination: o.destination,
        })) : undefined,
      })
      return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } })
    }

    const activeRoutes = phoneNumber.campaign.callRoutes
    if (activeRoutes.length > 0) {
      const twiml = generateTwiML({ destination: activeRoutes[0].destination })
      return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } })
    }

    const twiml = generateTwiML({})
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } })
  } catch (error) {
    const VoiceResponse = require('twilio').twiml.VoiceResponse
    const twiml = new VoiceResponse()
    twiml.say('An error occurred. Goodbye.')
    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } })
  }
}
