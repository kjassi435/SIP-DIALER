const TELNYX_API_KEY = process.env.TELNYX_API_KEY || ''
const BASE_URL = 'https://api.telnyx.com/v2'

async function telnyxFetch(path: string, options: any = {}) {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TELNYX_API_KEY}`,
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.errors?.[0]?.detail || 'Telnyx API error')
  return data
}

export async function listAvailableNumbers(areaCode?: string, limit = 20) {
  try {
    const params = new URLSearchParams({ limit: String(limit) })
    if (areaCode) params.set('filter[phone_number][starts_with]', `+1${areaCode}`)
    const res = await telnyxFetch(`/available_phone_numbers?${params}`)
    return res.data || []
  } catch (e: any) {
    if (areaCode && e.message?.includes('starts_with')) {
      const res = await telnyxFetch(`/available_phone_numbers?page[size]=${limit}`)
      return res.data || []
    }
    throw e
  }
}

export async function purchaseNumber(phoneNumber: string) {
  const res = await telnyxFetch('/number_orders', {
    method: 'POST',
    body: JSON.stringify({
      phone_numbers: [{ phone_number: phoneNumber }],
    }),
  })
  return res.data
}

export async function reserveNumber(phoneNumber: string) {
  const res = await telnyxFetch('/number_reservations', {
    method: 'POST',
    body: JSON.stringify({
      phone_numbers: [{ phone_number: phoneNumber }],
    }),
  })
  return res.data
}

export async function reserveAndPurchaseNumber(maskedPhoneNumber: string) {
  const reservation = await reserveNumber(maskedPhoneNumber)
  const fullNumber = reservation.phone_numbers?.[0]?.phone_number || maskedPhoneNumber
  const order = await purchaseNumber(fullNumber)
  return { order, phoneNumber: fullNumber }
}

export async function listMyNumbers() {
  const res = await telnyxFetch('/phone_numbers?page[size]=50')
  return res.data || []
}

export async function releaseNumber(telnyxId: string) {
  return await telnyxFetch(`/phone_numbers/${telnyxId}`, { method: 'DELETE' })
}

export async function createOutboundVoiceProfile(name: string) {
  const res = await telnyxFetch('/outbound_voice_profiles', {
    method: 'POST',
    body: JSON.stringify({
      name,
      traffic_type: 'conversational',
      service_plan: 'global',
      concurrent_call_limit: 10,
    }),
  })
  return res.data
}

export async function listOutboundVoiceProfiles() {
  const res = await telnyxFetch('/outbound_voice_profiles')
  return res.data || []
}

export async function getOrCreateConnection(name = 'MCT Call Control') {
  const conns = await telnyxFetch('/connections?page[size]=20')
  const existing = conns.data?.find((c: any) => c.connection_name === name)
  if (existing) return existing
  const res = await telnyxFetch('/connections', {
    method: 'POST',
    body: JSON.stringify({
      connection_name: name,
      connection_type: 'credential',
      default: false,
    }),
  })
  return res.data
}

export async function initiateCall(
  fromNumber: string,
  toNumber: string,
  webhookUrl: string
) {
  const res = await telnyxFetch('/calls', {
    method: 'POST',
    body: JSON.stringify({
      connection_id: process.env.TELNYX_CONNECTION_ID,
      from: fromNumber,
      to: toNumber,
      webhook_url: webhookUrl,
      webhook_event: 'call.initiated',
    }),
  })
  return res.data
}

export async function transferCall(callControlId: string, to: string) {
  return await telnyxFetch(`/calls/${callControlId}/actions/transfer`, {
    method: 'POST',
    body: JSON.stringify({ destination: to }),
  })
}

export async function hangupCall(callControlId: string) {
  return await telnyxFetch(`/calls/${callControlId}/actions/hangup`, {
    method: 'POST',
  })
}

export async function startRecording(callControlId: string) {
  return await telnyxFetch(`/calls/${callControlId}/actions/record_start`, {
    method: 'POST',
  })
}

export async function stopRecording(callControlId: string) {
  return await telnyxFetch(`/calls/${callControlId}/actions/record_stop`, {
    method: 'POST',
  })
}

export async function speakText(callControlId: string, text: string, voice = 'female') {
  return await telnyxFetch(`/calls/${callControlId}/actions/speak`, {
    method: 'POST',
    body: JSON.stringify({ payload: text, voice, language: 'en-US' }),
  })
}

export async function gatherInput(callControlId: string, prompt: string, timeout = 10) {
  return await telnyxFetch(`/calls/${callControlId}/actions/gather_using_speak`, {
    method: 'POST',
    body: JSON.stringify({
      payload: prompt,
      voice: 'female',
      language: 'en-US',
      valid_digits: '1234567890',
      max_digits: 1,
      timeout,
    }),
  })
}
