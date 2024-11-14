import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { convertDateToUTC } from '@/lib/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');

  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startDate = convertDateToUTC(startDateParam);
  const endDate = convertDateToUTC(endDateParam);

  const { data: revenueData, error: revenueError } = await supabase
    .from('transactions')
    .select('amount, category, status, user_uid')
    .eq('status', 'completed')
    .eq('type', 'income')
    .eq('user_uid', userData.user.id)
    .gte('created_at', `${startDate} 00:00:00`)
    .lte('created_at', `${endDate} 23:59:59`);

  if (revenueError) {
    console.error('Error fetching revenue by category:', revenueError);
    return NextResponse.json({ error: 'Failed to fetch revenue by category' }, { status: 500 });
  }

  const revenueByCategory = revenueData?.reduce((acc, item) => {
    const category = item.category; // Acessando a categoria do primeiro produto
    if (!category) {
      return acc; // Se a categoria não existir, continuar para o último item
    }
    const revenue = item.amount;
    if (acc[category]) {
      acc[category] += revenue;
    } else {
      acc[category] = revenue;
    }
    return acc;
  }, {} as Record<string, number>);

  return NextResponse.json({ revenueByCategory });
}
