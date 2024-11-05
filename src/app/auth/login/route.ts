import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const credentials = await request.json();
  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  })
  if (error) {
    return NextResponse.json({
      message: error.message
    },{ status: 401 })
  }
  return NextResponse.json({
    message: 'User authenticated'
  }, { status: 200 });
}