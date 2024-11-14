import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orderId = params.orderId;

  const { data, error } = await supabase
    .from('order_items')
    .select(`
      *, 
      product:product_id (
        id,
        name
      ), 
      order:order_id (
        id
      )`
    )
    .eq('order_id', orderId)
    .eq('order.user_uid', user.id)

  if (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Order not found or not authorized' }, { status: 404 })
  }

  return NextResponse.json(data)
}
