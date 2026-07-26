import { NextRequest, NextResponse } from 'next/server'
import { validateAdmin, generateToken } from '@/lib/auth'
import { LoginSchema } from '@/utils/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = LoginSchema.parse(body)
    const admin = await validateAdmin(validated.loginId, validated.password)
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    const token = generateToken(admin.id, admin.loginId)
    const response = NextResponse.json({
      access_token: token,
      token_type: 'Bearer',
      expires_in_hours: 8,
    })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60,
      path: '/',
    })
    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 400 }
    )
  }
}
