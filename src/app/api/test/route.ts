import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function GET() {
  const results: any = {}
  try {
    const hash = bcrypt.hashSync('test123', 12)
    const valid = bcrypt.compareSync('test123', hash)
    results.bcrypt = { hashLength: hash.length, valid }
  } catch (e: any) {
    results.bcrypt = { error: e.message }
  }

  try {
    const token = jwt.sign({ id: '123' }, process.env.NEXTAUTH_SECRET || 'secret', { expiresIn: '1h' })
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'secret')
    results.jwt = { tokenLength: token.length, decoded }
  } catch (e: any) {
    results.jwt = { error: e.message }
  }

  return NextResponse.json(results)
}
