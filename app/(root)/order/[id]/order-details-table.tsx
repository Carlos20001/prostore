'use client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils'
import { Order } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { approvePayPalOrder, createPayPalOrder, deliverOrder, updateOrderToPaidCOD } from '@/lib/actions/order.actions'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import StripePayment from './stripe-payment'


type Props = {
	order: Omit<Order, 'paymentResult'>
	paypalClientId: string
	isAdmin: boolean
	stripeClientSecret: string | null
}

const OrderDetailsTable = ({ order, paypalClientId, isAdmin, stripeClientSecret }: Props) => {
	const { id, shippingAddress, orderitems, itemsPrice, shippingPrice, taxPrice, totalPrice, paymentMethod, isPaid, isDelivered, paidAt, deliveredAt } =
		order

	const PrintLoadingState = () => {
		const [{ isPending, isRejected }] = usePayPalScriptReducer()
		let status = ''

		if (isPending) {
			status = 'Loading PayPal...'
		} else if (isRejected) {
			status = 'Error Loading PayPal'
		}

		return status
	}

	const handleCreatePayPalOrder = async () => {
		const res = await createPayPalOrder(order.id)

		if (!res.success) {
			toast.error('Operation failed', {
				description: res.message,
			})
		}

		return res.data
	}

	const handleApprovePayPalOrder = async (data: { orderID: string }) => {
		const res = await approvePayPalOrder(order.id, data)

		if (res.success) {
			toast.success('Operation success', {
				description: res.message,
			})
		} else {
			toast.error('Operation failed', {
				description: res.message,
			})
		}
	}

	//  Button to mark order as paid
	const MarkAsPaidButton = () => {
		const [isPending, startTransition] = useTransition()
		return (
			<Button
				type='button'
				className='w-full'
				disabled={isPending}
				onClick={() =>
					startTransition(async () => {
						const res = await updateOrderToPaidCOD(order.id)
						if (res.success) {
							toast.success('Operation success', { description: res.message })
						} else {
							toast.error('Operation failed', { description: res.message })
						}
					})
				}
			>
				{isPending ? 'processing...' : 'Mark As Paid'}
			</Button>
		)
	}

	//  Button to mark order as delivered
	const MarkAsDeliveredButton = () => {
		const [isPending, startTransition] = useTransition()
		return (
			<Button
				type='button'
				className='w-full'
				disabled={isPending}
				onClick={() =>
					startTransition(async () => {
						const res = await deliverOrder(order.id)
						if (res.success) {
							toast.success('Operation success', { description: res.message })
						} else {
							toast.error('Operation failed', { description: res.message })
						}
					})
				}
			>
				{isPending ? 'processing...' : 'Mark As Delivered'}
			</Button>
		)
	}
	return (
		<>
			<h1 className='py-4 text-2xl'>Order {formatId(id)}</h1>
			<div className='grid md:grid-cols-3 gap-3'>
				<div className='col-span-3 md:col-span-2 space-y-3 overflow-x-auto'>
					<Card className='gap-0'>
						<CardHeader>
							<CardTitle>Payment Method</CardTitle>
						</CardHeader>
						<CardContent className='px-6 my-3 text-sm'>
							<p>{paymentMethod}</p>
						</CardContent>
						<CardFooter>
							{isPaid ? <Badge variant={'secondary'}>Paid at {formatDateTime(paidAt!).dateTime}</Badge> : <Badge variant={'destructive'}>Not paid</Badge>}
						</CardFooter>
					</Card>
					<Card className='gap-0'>
						<CardHeader>
							<CardTitle>Shipping Address</CardTitle>
						</CardHeader>
						<CardContent className='px-6 my-3 text-sm'>
							<p>{shippingAddress.fullName}</p>
							<p className='mb-2'>
								{shippingAddress.streetAddress}, {shippingAddress.city},{shippingAddress.postalCode}, {shippingAddress.country}
							</p>
						</CardContent>
						<CardFooter>
							{isDelivered ? (
								<Badge variant={'secondary'}>Delivered at {formatDateTime(deliveredAt!).dateTime}</Badge>
							) : (
								<Badge variant={'destructive'}>Not delivered</Badge>
							)}
						</CardFooter>
					</Card>
					<Card className='gap-0'>
						<CardHeader>
							<CardTitle>Order Items</CardTitle>
						</CardHeader>
						<CardContent className='px-6 my-3 text-sm'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead>Quantity</TableHead>
										<TableHead className='text-right'>Price</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{orderitems.map(item => (
										<TableRow key={item.slug}>
											<TableCell>
												<Link
													href={`/product/${item.slug}`}
													className='flex items-center'
												>
													<Image
														src={item.image}
														alt={item.name}
														width={50}
														height={50}
													/>
													<span className='px-2'>{item.name}</span>
												</Link>
											</TableCell>
											<TableCell>
												<span className='px-2'>{item.qty}</span>
											</TableCell>
											<TableCell className='text-right'>${Number(item.price).toFixed(2)}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>

				<div className='col-span-3 md:col-span-1'>
					<Card className='gap-0'>
						<CardHeader>
							<CardTitle>Summary</CardTitle>
						</CardHeader>
						<CardContent className='px-6 mt-3 text-sm space-y-2'>
							<div className='flex justify-between'>
								<div>Items</div>
								<div>{formatCurrency(itemsPrice)}</div>
							</div>
							<div className='flex justify-between'>
								<div>Tax</div>
								<div>{formatCurrency(taxPrice)}</div>
							</div>
							<div className='flex justify-between'>
								<div>Shipping</div>
								<div>{formatCurrency(shippingPrice)}</div>
							</div>
							<div className='flex justify-between'>
								<div>Total</div>
								<div>{formatCurrency(totalPrice)}</div>
							</div>
						</CardContent>
						{(!isPaid || !isDelivered) && (
							<CardFooter className='mt-8'>
								{/* PayPal Payment */}
								{!isPaid && paymentMethod && (
									<div
										className='w-full'
										style={{ colorScheme: 'none' }}
									>
										<PayPalScriptProvider options={{ clientId: paypalClientId }}>
											<PrintLoadingState />
											<PayPalButtons
												createOrder={handleCreatePayPalOrder}
												onApprove={handleApprovePayPalOrder}
											/>
										</PayPalScriptProvider>
									</div>
								)}

								{!isPaid && paymentMethod === 'Stripe' && stripeClientSecret && (
									<StripePayment
										priceInCents={Number(order.totalPrice) * 100}
										orderId={order.id}
										clientSecret={stripeClientSecret}
									/>
								)}

								{/* Cash On Delivery */}
								{isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && <MarkAsPaidButton />}
								{isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
							</CardFooter>
						)}
					</Card>
				</div>
			</div>
		</>
	)
}
export default OrderDetailsTable