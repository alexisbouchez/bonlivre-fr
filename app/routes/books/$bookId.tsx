import { Book, Review } from "@prisma/client";
import { useState } from "react";
import { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import { useActionData, useLoaderData } from "remix";
import BookshelfActions from "~/components/concerns/books/bookshelves/BookshelfActions";
import Container from "~/components/concerns/layouts/Container";
import Reviews from "~/components/concerns/books/reviews/Reviews";
import {
  deleteBookshelfItem,
  getBookshelfStatus,
  updateBookshelfStatus,
} from "~/utils/bookshelf.server";
import { getBookById } from "~/utils/book.server";
import { ReviewWithUser } from "~/utils/review.server";
import {
  createReview,
  deleteReview,
  getReviewFromBookForUser,
  getReviewsForBook,
  updateReview,
} from "~/utils/review.server";
import { getUserId } from "~/utils/session.server";
import { getGenreLabelFromValue } from "~/constants/genres";
import NewReviewModal from "~/components/concerns/books/reviews/NewReviewModal";

export const meta: MetaFunction = ({ data }) => {
  const { book } = data;
  const { title, author } = book;

  return {
    title: `BonLivre - ${title} ; ${author}`,
    author,
    description: `${title} par ${author}`,
  };
};

type LoaderData = {
  book?: Book;
  bookShelfStatus?: string;
  reviews: ReviewWithUser[];
  alreadyReviewed: boolean;
  ownedReview?: ReviewWithUser;
  averageStars?: number;
  numberOfStars?: number;
  signedIn?: boolean;
  counts?: [number, number, number, number, number];
  userId?: string;
};

export const throwNotFoundException = () => {
  throw new Response("Not Found", {
    status: 404,
  });
};

export const loader: LoaderFunction = async ({
  request,
  params: { bookId },
}) => {
  // Get the book by id
  if (!bookId) {
    return throwNotFoundException();
  }

  const book = await getBookById(bookId);

  if (!book) {
    return throwNotFoundException();
  }

  // Fetch reviews
  const { reviews, averageStars, counts } = await getReviewsForBook(bookId);

  // Get the book shelf status for the current user
  const userId = await getUserId(request);
  if (!userId) {
    return { book, signedIn: false, reviews, averageStars, counts };
  }

  const bookShelfStatus = await getBookshelfStatus(userId, bookId);

  // Has the user already reviewed this book ?
  let alreadyReviewed = false;
  let ownedReview;

  if (userId) {
    for (const review of reviews) {
      if (review.userId === userId) {
        alreadyReviewed = true;
        ownedReview = review;
        break;
      }
    }
  }

  return {
    book,
    bookShelfStatus,
    reviews,
    alreadyReviewed,
    ownedReview,
    averageStars,
    numberOfStars: reviews.length,
    signedIn: true,
    counts,
    userId,
  };
};

type ActionData = {
  status?: string;
  _action?: string;
  review?: Review;
};

export const action: ActionFunction = async ({
  request,
  params: { bookId },
}) => {
  if (!bookId || typeof bookId !== "string") {
    return null;
  }

  const userId = await getUserId(request);

  if (!userId) {
    return null;
  }

  const formData = await request.formData();
  const _action = formData.get("_action");

  if (request.method === "DELETE" && _action === "bookshelf") {
    await deleteBookshelfItem(userId, bookId);

    return null;
  }

  if (request.method === "DELETE" && !_action) {
    const reviewId = formData.get("reviewId");
    if (typeof reviewId !== "string") {
      return null;
    }
    await deleteReview(reviewId);
    return null;
  }

  if (_action === "bookshelf") {
    const status = formData.get("status");

    if (!status || typeof status !== "string") {
      return null;
    }

    const updateSuccess = await updateBookshelfStatus(userId, bookId, status);

    if (!updateSuccess) {
      return null;
    }

    return { status, _action };
  }

  if (_action === "review") {
    const comment = formData.get("comment");
    const stars = formData.get("stars");

    if (!comment || typeof comment !== "string") {
      return null;
    }

    if (!stars || typeof stars !== "string" || !parseInt(stars, 10)) {
      return null;
    }

    let review = await getReviewFromBookForUser(bookId, userId);

    if (review) {
      review = await updateReview(review.id, {
        comment,
        stars: parseInt(stars, 10),
      });
    } else {
      review = await createReview({
        bookId,
        userId,
        comment,
        stars: parseInt(stars, 10),
      });
    }

    return { review, _action };
  }

  return null;
};

export default function BookPage() {
  const loaderData = useLoaderData<LoaderData>();
  const {
    book,
    reviews,
    alreadyReviewed,
    ownedReview,
    averageStars,
    numberOfStars,
    signedIn,
    counts,
    userId,
  } = loaderData;
  let { bookShelfStatus } = loaderData;
  const actionData = useActionData<ActionData>();
  const [open, setOpen] = useState(false);

  if (actionData?.status) {
    bookShelfStatus = actionData.status;
  }

  return (
    <div className="fullheight">
      <Container>
        <div className="flex flex-col border-b py-16 sm:flex-row">
          <div className="flex justify-center">
            {book?.cover && (
              <img src={book.cover} className="h-80 max-w-md rounded shadow" />
            )}
          </div>
          <div className="pl-16 pt-8 sm:pt-0">
            <h3 className="text-5xl font-bold">{book?.title}</h3>
            <h4 className="text-3xl">{book?.author}</h4>
            <p className="text-xl">{book?.year}</p>
            <p className="text-lg">{getGenreLabelFromValue(book?.genre)}</p>

            {userId && (
              <BookshelfActions
                bookId={book?.id}
                bookshelfStatus={bookShelfStatus}
              />
            )}
          </div>
        </div>
      </Container>

      <NewReviewModal open={open} setOpen={setOpen} ownedReview={ownedReview} />

      <Reviews
        setOpen={setOpen}
        reviews={reviews}
        alreadyReviewed={alreadyReviewed}
        ownedReview={ownedReview}
        averageStars={averageStars}
        numberOfStars={numberOfStars}
        signedIn={signedIn}
        counts={counts}
      />
    </div>
  );
}
