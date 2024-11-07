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

  const { data: transactionsData, error: transactionsError } = await supabase
    .from('transactions')
    .select('amount, type, category, created_at')
    .eq('status', 'completed')
    .eq('user_uid', user.id)
    .gte('created_at', `${startDate} 00:00:00`)
    .lte('created_at', `${endDate} 23:59:59`)
    .order('created_at', { ascending: true });

  if (transactionsError) {
    console.error('Error fetching transactions:', transactionsError);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }

  const sellingTransactions = transactionsData?.filter(transaction => transaction.category === 'selling');
  const expenseTransactions = transactionsData?.filter(transaction => transaction.type === 'expense');

  if (!sellingTransactions || !expenseTransactions) {
    return NextResponse.json({ error: 'Failed to calculate profit margin' }, { status: 500 });
  }

  const totalSelling = sellingTransactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;
  const totalExpenses = expenseTransactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;

  const totalProfit = totalSelling - totalExpenses;

  return NextResponse.json({ totalProfit });
}
