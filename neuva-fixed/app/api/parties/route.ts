import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PartySchema } from '@/utils/validation'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const parties = await prisma.party.findMany({
      where: { name: { contains: search, mode: 'insensitive' } },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(parties)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch parties' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = PartySchema.parse(body)
    const party = await prisma.party.create({
      data: {
        name: validated.name,
        billingName: validated.billingName || null,
        location: validated.location || null,
      },
    })
    return NextResponse.json(party, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create party' }, { status: 400 })
  }
}
