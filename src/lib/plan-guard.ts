import { prisma } from './prisma'
import { PLANS } from './plans'

export async function checkPlanLimit(
  userId: string,
  resource: 'numbers' | 'campaigns' | 'routes' | 'ivrMenus'
) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')

  const plan = PLANS[user.plan as keyof typeof PLANS]
  if (!plan) throw new Error('Invalid plan')

  const limitMap = {
    numbers: plan.maxNumbers,
    campaigns: plan.maxCampaigns,
    routes: plan.maxRoutes,
    ivrMenus: plan.maxIvrMenus,
  }
  const max = limitMap[resource]
  if (max === Infinity) return true

  const count = await (() => {
    switch (resource) {
      case 'numbers': return prisma.phoneNumber.count({ where: { userId } })
      case 'campaigns': return prisma.campaign.count({ where: { userId } })
      case 'routes': return prisma.callRoute.count({ where: { userId } })
      case 'ivrMenus': return prisma.ivrMenu.count({ where: { userId } })
    }
  })()

  if (count >= max) {
    throw new Error(`Plan limit reached: max ${max} ${resource} allowed on ${plan.name} plan. Upgrade to add more.`)
  }
  return true
}
