import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TransactionSchema } from '@/utils/validation'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { party: true, transactionType: true },
    })
    if (!transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    return NextResponse.json(transaction)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch transaction' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const validated = TransactionSchema.parse({ ...body, date: new Date(body.date) })
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        date: validated.date,
        partyId: validated.partyId,
        transactionNote: validated.transactionNote || null,
        typeId: validated.typeId,
        amount: validated.amount,
      },
      include: { party: true, transactionType: true },
    })
    return NextResponse.json(transaction)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update transaction' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    await prisma.transaction.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete transaction' }, { status: 400 })
  }
}
