import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { PLANS } from '@/lib/plans'

export async function GET() {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ user: null })
    const plan = PLANS[user.plan as keyof typeof PLANS]
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan, planName: plan?.name || 'Free' } })
  } catch {
    return NextResponse.json({ user: null })
  }
}
