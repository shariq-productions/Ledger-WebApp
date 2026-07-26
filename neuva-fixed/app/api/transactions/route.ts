import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TransactionSchema } from '@/utils/validation'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const partyId = searchParams.get('partyId')
    const tillDate = searchParams.get('tillDate')
    const where: any = {}
    if (partyId) where.partyId = parseInt(partyId)
    if (tillDate) where.date = { lte: new Date(tillDate) }
    const transactions = await prisma.transaction.findMany({
      where,
      include: { party: true, transactionType: true },
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(transactions)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = TransactionSchema.parse({ ...body, date: new Date(body.date) })
    const lastTransaction = await prisma.transaction.findFirst({ orderBy: { serialNumber: 'desc' } })
    const nextSerial = (lastTransaction?.serialNumber || 0) + 1
    const transaction = await prisma.transaction.create({
      data: {
        serialNumber: nextSerial,
        date: validated.date,
        partyId: validated.partyId,
        transactionNote: validated.transactionNote || null,
        typeId: validated.typeId,
        amount: validated.amount,
      },
      include: { party: true, transactionType: true },
    })
    return NextResponse.json(transaction, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create transaction' }, { status: 400 })
  }
}
