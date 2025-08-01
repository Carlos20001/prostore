'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createUpdateReview, getReviewByProductId } from '@/lib/actions/review.actions'
import { reviewFormDefaultValues } from '@/lib/constants'
import { insertReviewSchema } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { StarIcon } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type Props = {
	userId: string
	productId: string
	onReviewSubmitted: () => void
}
const ReviewForm = ({ userId, productId, onReviewSubmitted }: Props) => {
	const [open, setOpen] = useState(false)

	const form = useForm<z.infer<typeof insertReviewSchema>>({
		resolver: zodResolver(insertReviewSchema),
		defaultValues: reviewFormDefaultValues,
	})

	// Open form handler
	const handleOpenForm = async () => {
		form.setValue('productId', productId)
		form.setValue('userId', userId)

		const review = await getReviewByProductId({ productId })
		if (review) {
			form.setValue('title', review.title)
			form.setValue('description', review.description)
			form.setValue('rating', review.rating)
		}
		setOpen(true)
	}

	// Submit form handler
	const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async values => {
		const res = await createUpdateReview({ ...values, productId })

		if (!res.success) {
			return toast.error('Operation failed', { description: res.message })
		}

		setOpen(false)

		onReviewSubmitted()

		toast.success('Operation success', { description: res.message })
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<Button onClick={handleOpenForm}>Write a Review</Button>
			<DialogContent className='sm:max-w-[425px]'>
				<Form {...form}>
					<form
						method='post'
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<DialogHeader>
							<DialogTitle>Write a Review</DialogTitle>
							<DialogDescription>Share your thoughts with other customers</DialogDescription>
						</DialogHeader>
						<div className='grid gap-4 py-4'>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input
												placeholder='Enter title'
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Enter description'
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='rating'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Rating</FormLabel>
										<Select
											defaultValue={!field.value ? undefined : field.value.toString()}
											value={!field.value ? undefined : field.value.toString()}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder='Select a rating' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Array.from({ length: 5 }).map((_, i) => (
													<SelectItem
														key={i}
														value={(i + 1).toString()}
													>
														{i + 1} <StarIcon className='inline h-4 w-4' />
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button
								type='submit'
								size={'lg'}
								className='w-full'
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
export default ReviewForm