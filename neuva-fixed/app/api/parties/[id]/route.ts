import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PartySchema } from '@/utils/validation'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const party = await prisma.party.findUnique({
      where: { id },
      include: { transactions: { include: { transactionType: true }, orderBy: { date: 'desc' } } },
    })
    if (!party) return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    return NextResponse.json(party)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch party' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const validated = PartySchema.parse(body)
    const party = await prisma.party.update({
      where: { id },
      data: {
        name: validated.name,
        billingName: validated.billingName || null,
        location: validated.location || null,
      },
    })
    return NextResponse.json(party)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update party' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    await prisma.party.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete party' }, { status: 400 })
  }
}
