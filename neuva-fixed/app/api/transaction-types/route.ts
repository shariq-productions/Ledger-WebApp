import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TransactionTypeSchema } from '@/utils/validation'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const types = await prisma.transactionType.findMany({
      where: { note: { contains: search, mode: 'insensitive' } },
      orderBy: { note: 'asc' },
    })
    return NextResponse.json(types)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch transaction types' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = TransactionTypeSchema.parse(body)
    const type = await prisma.transactionType.create({
      data: { note: validated.note, type: validated.type },
    })
    return NextResponse.json(type, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create transaction type' }, { status: 400 })
  }
}
