import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TransactionTypeSchema } from '@/utils/validation'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const type = await prisma.transactionType.findUnique({ where: { id } })
    if (!type) return NextResponse.json({ error: 'Transaction type not found' }, { status: 404 })
    return NextResponse.json(type)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch transaction type' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const validated = TransactionTypeSchema.parse(body)
    const type = await prisma.transactionType.update({
      where: { id },
      data: { note: validated.note, type: validated.type },
    })
    return NextResponse.json(type)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update transaction type' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    await prisma.transactionType.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete transaction type' }, { status: 400 })
  }
}
