import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getSession();
  if (session) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return res.status(400).json({ message: 'Failed to log out.' });
    } else {
      redirect('/error')
    }
  }
  return NextResponse.json({})
}