import { NextRequest, NextResponse } from 'next/server'
import { getRequiredSession } from '@/lib/auth'
import { listAvailableNumbers } from '@/lib/telnyx'

export async function GET(req: NextRequest) {
  try {
    await getRequiredSession()
    const areaCode = req.nextUrl.searchParams.get('areaCode') || undefined
    const numbers = await listAvailableNumbers(areaCode)
    return NextResponse.json({ numbers })
  } catch (error: any) {
    return NextResponse.json({ numbers: [], error: error.message }, { status: 200 })
  }
}
