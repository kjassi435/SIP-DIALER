import { NextRequest, NextResponse } from 'next/server'
import { generateTwiML } from '@/lib/twilio'
import twilio from 'twilio'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const digits = formData.get('Digits') as string
    const calledNumber = formData.get('To') as string

    const VoiceResponse = twilio.twiml.VoiceResponse
    const twiml = new VoiceResponse()

    if (digits) {
      twiml.say(`You pressed ${digits}. Transferring your call.`)
      twiml.dial('+1234567890')
    } else {
      twiml.say('No input received. Goodbye.')
      twiml.hangup()
    }

    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } })
  } catch (error) {
    const VoiceResponse = twilio.twiml.VoiceResponse
    const twiml = new VoiceResponse()
    twiml.say('An error occurred. Goodbye.')
    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } })
  }
}
