import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getSession();
  if (session) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return NextResponse.json({ error: 'Failed to log out.' }, { status: 400 });
    } else {
      redirect('/login')
    }
  }
  return NextResponse.json({})
}