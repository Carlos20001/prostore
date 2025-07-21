import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.actions';
import { notFound, redirect } from 'next/navigation';
import OrderDetailsTable from './order-details-table';
import { ShippingAddress } from '@/types';
import { auth } from '@/auth';


export const metadata: Metadata = {
  title: 'Order Details',
};

const OrderDetailsPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const { id } = params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

    console.log(order)

  // If user is not the owner or not admin, redirect
  if (order.userId !== session?.user?.id && session?.user?.role !== 'admin') {
    redirect('/unauthorized');
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      isAdmin={session?.user?.role === 'admin' || false}
    />
  );
};

export default OrderDetailsPage;
