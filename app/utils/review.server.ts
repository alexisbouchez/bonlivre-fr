import { Review, User } from "@prisma/client";
import { db } from "./db.server";

export interface CreateReviewArgs {
  userId: string;
  bookId: string;
  stars: number;
  comment: string;
}

export async function createReview(
  createReviewArgs: CreateReviewArgs
): Promise<Review | null> {
  try {
    const review = await db.review.create({ data: createReviewArgs });

    return review;
  } catch {
    return null;
  }
}

export type ReviewWithUser = Review & {
  user: User;
};

export async function getReviewsForBook(bookId: string): Promise<{
  reviews: ReviewWithUser[];
  averageStars: number | null;
  numberOfStars: number | null;
  counts: [number, number, number, number, number];
}> {
  try {
    const reviews = await db.review.findMany({
      where: { bookId },
      include: { user: true },
    });

    let sumOfStars = 0;
    const numberOfStars = reviews.length;

    const counts: [number, number, number, number, number] = [0, 0, 0, 0, 0];

    for (const review of reviews) {
      sumOfStars += review.stars;
      counts[review.stars - 1] += 1;
    }

    const averageStars = sumOfStars / (numberOfStars || 1);

    return {
      reviews,
      averageStars,
      numberOfStars,
      counts,
    };
  } catch {
    return {
      reviews: [],
      averageStars: null,
      numberOfStars: null,
      counts: [0, 0, 0, 0, 0],
    };
  }
}

export async function getReviewFromBookForUser(bookId: string, userId: string) {
  try {
    const review = await db.review.findFirst({
      where: { bookId, userId },
    });

    return review;
  } catch {
    return null;
  }
}

export interface UpdateReviewArgs {
  stars: number;
  comment: string;
}

export async function updateReview(
  reviewId: string,
  updateReviewArgs: UpdateReviewArgs
) {
  try {
    const review = await db.review.update({
      where: { id: reviewId },
      data: updateReviewArgs,
    });

    return review;
  } catch {
    return null;
  }
}

export async function deleteReview(reviewId: string) {
  try {
    await db.review.delete({ where: { id: reviewId } });
  } catch {}
}
