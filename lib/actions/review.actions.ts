'use server';

import { auth } from '@/auth';
import { formatError } from '../utils';
import { insertReviewSchema } from '../validators';
import { z } from 'zod';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';

// CREATE or UPDATE a review
export async function createUpdateReview(data: z.infer<typeof insertReviewSchema>) {
  try {
    const session = await auth();
    if (!session) throw new Error('User is not authenticated');

    const review = insertReviewSchema.parse({
      ...data,
      userId: session.user.id,
    });

    const product = await prisma.product.findUnique({
      where: { id: review.productId },
    });
    if (!product) throw new Error('Product not found');

    const existingReview = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (existingReview) {
        await tx.review.update({
          where: { id: existingReview.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        await tx.review.create({ data: review });
      }

      const ratingAgg = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });

      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: ratingAgg._avg.rating || 0,
          numReviews,
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);
    return { success: true, message: 'Review updated successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all reviews for a product
export async function getReviews({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return { data };
}

// Get a review by the logged-in user for a specific product
export async function getReviewByProductId({ productId }: { productId: string }) {
  const session = await auth();
  if (!session) throw new Error('User is not authenticated');

  const review = await prisma.review.findFirst({
    where: {
      productId,
      userId: session.user.id,
    },
  });

  return review;
}
