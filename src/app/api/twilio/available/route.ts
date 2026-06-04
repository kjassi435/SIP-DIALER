import { NextRequest, NextResponse } from 'next/server'
import { searchAvailableNumbers } from '@/lib/twilio'

export async function GET(req: NextRequest) {
  try {
    const areaCode = req.nextUrl.searchParams.get('areaCode') || undefined
    const numbers = await searchAvailableNumbers(areaCode)
    return NextResponse.json({ numbers })
  } catch (error: any) {
    return NextResponse.json({ error: error.message, numbers: [] }, { status: 500 })
  }
}
