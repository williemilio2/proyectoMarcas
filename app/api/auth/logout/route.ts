import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {

  (await cookies()).delete('accountToken')

  return NextResponse.json({
    success: true,
  })
}