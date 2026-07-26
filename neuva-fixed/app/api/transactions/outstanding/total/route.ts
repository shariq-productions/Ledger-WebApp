import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const partyId = searchParams.get('partyId')
    const tillDate = searchParams.get('tillDate')
    const where: any = {}
    if (partyId) where.partyId = parseInt(partyId)
    if (tillDate) where.date = { lte: new Date(tillDate) }
    const transactions = await prisma.transaction.findMany({ where, include: { transactionType: true } })
    let addTotal = 0
    let reduceTotal = 0
    for (const transaction of transactions) {
      if (transaction.transactionType.type === 'add') {
        addTotal += transaction.amount
      } else {
        reduceTotal += transaction.amount
      }
    }
    return NextResponse.json({ total: addTotal - reduceTotal, addTotal, reduceTotal })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to calculate outstanding total' }, { status: 500 })
  }
}
