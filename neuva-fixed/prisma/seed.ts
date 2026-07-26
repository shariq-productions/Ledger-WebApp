import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin (loginId is a real unique field, so upsert works as-is)
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.admin.upsert({
    where: { loginId: 'admin' },
    update: {},
    create: {
      loginId: 'admin',
      hashedPassword,
    },
  })

  // Transaction types don't have a natural unique key, so guard against
  // re-running the seed by checking for an existing row with the same note.
  const types: { note: string; type: 'add' | 'reduce' }[] = [
    { note: 'Cash Sale', type: 'add' },
    { note: 'Credit Sale', type: 'add' },
    { note: 'Cash Purchase', type: 'reduce' },
    { note: 'Credit Purchase', type: 'reduce' },
    { note: 'Payment Received', type: 'add' },
    { note: 'Payment Made', type: 'reduce' },
  ]
  for (const type of types) {
    const existing = await prisma.transactionType.findFirst({ where: { note: type.note } })
    if (!existing) {
      await prisma.transactionType.create({ data: type })
    }
  }

  // Same for parties - guard on name instead of a fake id: 0 match.
  const parties = [
    { name: 'ABC Traders', billingName: 'ABC Trading Co.', location: 'Mumbai' },
    { name: 'XYZ Enterprises', billingName: 'XYZ Enterprises Pvt Ltd', location: 'Delhi' },
    { name: 'PQR Suppliers', billingName: 'PQR Supply Chain', location: 'Bangalore' },
  ]
  for (const party of parties) {
    const existing = await prisma.party.findFirst({ where: { name: party.name } })
    if (!existing) {
      await prisma.party.create({ data: party })
    }
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
