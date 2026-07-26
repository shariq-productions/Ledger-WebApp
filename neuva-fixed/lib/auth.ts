import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  console.log("Comparing");
  return await bcrypt.compare(password, hashedPassword)
}

export const generateToken = (adminId: number, loginId: string): string => {
  return jwt.sign({ adminId, loginId }, JWT_SECRET, { expiresIn: '4weeks' })
}

export const verifyToken = (token: string): jwt.JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
  } catch {
    return null
  }
}

export const validateAdmin = async (loginId: string, password: string) => {
  const admin = await prisma.admin.findUnique({ where: { loginId } })
  if (!admin) return null
  const isValid = await comparePassword(password, admin.hashedPassword)
  if (!isValid) return null
  return admin
}
