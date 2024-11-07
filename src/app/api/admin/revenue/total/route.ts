import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');
  
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }
  const startDate = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(startDateParam || Date.now()));
  const endDate = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(endDateParam || Date.now()));
  
  const { data: revenueData, error: revenueError } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'income')
    .eq('user_uid', user.id)
    .eq('status', 'completed')
    .gte('created_at', `${startDate} 00:00:00`)
    .lte('created_at', `${endDate} 23:59:59`);

  if (revenueError) {
    console.error('Error fetching total revenue:', revenueError);
    return NextResponse.json({ error: 'Failed to fetch total revenue' }, { status: 500 });
  }

  const totalRevenue = revenueData?.reduce((sum, order) => sum + order.amount, 0) || 0;

  return NextResponse.json({ totalRevenue });
}
