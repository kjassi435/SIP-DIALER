import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const apiKey = process.env.TWILIO_API_KEY_SID!
const apiSecret = process.env.TWILIO_API_KEY_SECRET!

let client: twilio.Twilio | null = null

function getClient() {
  if (!client) {
    client = twilio(apiKey, apiSecret, { accountSid })
  }
  return client
}

export async function searchAvailableNumbers(areaCode?: string) {
  const c = getClient()
  const params: any = { limit: 10 }
  if (areaCode) params.areaCode = parseInt(areaCode, 10)
  const result = await c.availablePhoneNumbers('US').local.list(params)
  return result.map(n => ({
    phoneNumber: n.phoneNumber,
    friendlyName: n.friendlyName,
    locality: n.locality,
    region: n.region,
    postalCode: n.postalCode,
    rateCenter: n.rateCenter,
  }))
}

export async function getAvailableTollFree() {
  const c = getClient()
  const result = await c.availablePhoneNumbers('US').tollFree.list({ limit: 5 })
  return result.map(n => ({
    phoneNumber: n.phoneNumber,
    friendlyName: n.friendlyName,
  }))
}

export async function purchaseNumber(phoneNumber: string) {
  const c = getClient()
  const number = await c.incomingPhoneNumbers.create({
    phoneNumber,
  })
  return {
    sid: number.sid,
    phoneNumber: number.phoneNumber,
    friendlyName: number.friendlyName,
    voiceUrl: number.voiceUrl,
  }
}

export async function listPurchasedNumbers() {
  const c = getClient()
  const numbers = await c.incomingPhoneNumbers.list({ limit: 50 })
  return numbers.map(n => ({
    sid: n.sid,
    phoneNumber: n.phoneNumber,
    friendlyName: n.friendlyName,
    voiceUrl: n.voiceUrl,
    dateCreated: n.dateCreated,
  }))
}

export async function releaseNumber(sid: string) {
  const c = getClient()
  await c.incomingPhoneNumbers(sid).remove()
}

export function generateTwiML(options: { destination?: string; greeting?: string; options?: { digit: string; text: string; destination: string }[] }) {
  const VoiceResponse = twilio.twiml.VoiceResponse
  const twiml = new VoiceResponse()

  if (options.options && options.options.length > 0) {
    if (options.greeting) {
      twiml.say(options.greeting)
    }
    const gather = twiml.gather({
      numDigits: 1,
      action: '/api/webhooks/twilio/ivr',
      method: 'POST',
      timeout: 10,
    })
    for (const opt of options.options) {
      gather.say(`Press ${opt.digit} for ${opt.text}`)
    }
  } else if (options.destination) {
    twiml.dial(options.destination)
  } else {
    twiml.say('Thank you for calling. Goodbye.')
    twiml.hangup()
  }

  return twiml.toString()
}

export async function updateNumberWebhook(sid: string, webhookUrl: string) {
  const c = getClient()
  await c.incomingPhoneNumbers(sid).update({
    voiceUrl: webhookUrl,
    voiceMethod: 'POST',
  })
}
