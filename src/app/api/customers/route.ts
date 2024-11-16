import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get('query') || '';
  const status = searchParams.get('status') || 'all';
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let query = supabase
    .from('customers')
    .select('*')
    .ilike('name', `%${searchQuery}%`)
    .eq('user_uid', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query;

  if (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const newCustomer = await request.json();

  const { data, error } = await supabase
    .from('customers')
    .insert([
      { ...newCustomer, user_uid: user.id }
    ])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message, code: error.code || 0 }, { status: 500 })
  }

  return NextResponse.json(data[0])
}
