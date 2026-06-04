const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const p = new PrismaClient()

async function main() {
  const existing = await p.user.findUnique({ where: { email: 'admin@mct.com' } })
  if (existing) {
    console.log('Admin already exists:', existing.email, existing.role, existing.plan)
    await p.$disconnect()
    return
  }

  const hash = await bcrypt.hash('admin123', 12)
  const user = await p.user.create({
    data: { email: 'admin@mct.com', name: 'Admin', password: hash, role: 'SUPER_ADMIN', plan: 'PREMIUM' }
  })
  console.log('Created admin:', user.email, user.role, user.plan)

  const hash2 = await bcrypt.hash('test123', 12)
  const user2 = await p.user.create({
    data: { email: 'test@mct.com', name: 'Test User', password: hash2, plan: 'FREE' }
  })
  console.log('Created test user:', user2.email, user2.plan)

  // Add the Twilio number to admin
  const admin = await p.user.findUnique({ where: { email: 'admin@mct.com' } })
  const existingNum = await p.phoneNumber.findFirst({ where: { telnyxId: 'tw_PNb3f1ecdea2f62acb7e6f3694b1cbbd0e' } })
  if (!existingNum && admin) {
    await p.phoneNumber.create({
      data: { number: '+15707347328', telnyxId: 'tw_PNb3f1ecdea2f62acb7e6f3694b1cbbd0e', userId: admin.id, status: 'active' }
    })
    console.log('Added Twilio number to admin')
  }

  await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
