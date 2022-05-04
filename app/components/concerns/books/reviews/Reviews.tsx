import { StarIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { ReviewWithUser } from "~/utils/review.server";
import ReviewItem, { ReviewItemWhereOwned } from "./ReviewItem";
import DeleteReviewModal from "./DeleteReviewModal";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface ReviewsProps {
  setOpen: (_: boolean) => void;
  reviews: ReviewWithUser[];
  alreadyReviewed: boolean;
  ownedReview?: ReviewWithUser;
  averageStars?: number;
  numberOfStars?: number;
  signedIn?: boolean;
  counts?: [number, number, number, number, number];
}

const Reviews: React.FC<ReviewsProps> = ({
  setOpen,
  reviews,
  alreadyReviewed,
  ownedReview,
  averageStars,
  signedIn,
  counts,
}) => {
  const [deleteReviewModalOpen, setDeleteReviewModalOpen] =
    useState<boolean>(false);

  return (
    <div className="bg-white">
      {ownedReview && (
        <DeleteReviewModal
          open={deleteReviewModalOpen}
          setOpen={setDeleteReviewModalOpen}
          reviewId={ownedReview.id}
        />
      )}
      <div className="lg:py-18 mx-auto max-w-2xl py-8 px-4 sm:py-12 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="lg:col-span-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Avis des lecteurs
          </h2>

          <div className="mt-3 flex items-center">
            <div>
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={classNames(
                      Math.round(averageStars || 0) > rating
                        ? "text-yellow-400"
                        : "text-gray-300",
                      "h-5 w-5 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="sr-only">
                Moyenne de {Math.round(averageStars || 0)}/5
              </p>
            </div>
            <p className="ml-2 text-sm text-gray-900">
              Moyenne de {Math.round(averageStars || 0)}/5 basée sur{" "}
              {reviews?.length || 0} avis
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Review data</h3>

            <dl className="space-y-3">
              {counts?.map((count, index) => (
                <div key={index} className="flex items-center text-sm">
                  <dt className="flex flex-1 items-center">
                    <p className="w-3 font-medium text-gray-900">
                      {index + 1}
                      <span className="sr-only"> star reviews</span>
                    </p>
                    <div
                      aria-hidden="true"
                      className="ml-1 flex flex-1 items-center"
                    >
                      <StarIcon
                        className={classNames(
                          count > 0 ? "text-yellow-400" : "text-gray-300",
                          "h-5 w-5 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />

                      <div className="relative ml-3 flex-1">
                        <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                        {count > 0 ? (
                          <div
                            className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                            style={{
                              width: `calc(${count} / ${reviews.length} * 100%)`,
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  </dt>
                  <dd className="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">
                    {Math.round(
                      (count / (reviews.length === 0 ? 1 : reviews.length)) *
                        100
                    )}
                    %
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {signedIn && (
            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-900">
                Partagez votre avis
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Qu'avez-vous pensé de ce livre ?
              </p>

              <button
                className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-8 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full"
                onClick={() => setOpen(true)}
              >
                {alreadyReviewed ? "Modifier mon" : "Ajouter un"} avis
              </button>

              {alreadyReviewed && (
                <button
                  className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-8 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full"
                  onClick={() => setDeleteReviewModalOpen(true)}
                >
                  Supprimer mon avis
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <h3 className="sr-only">Avis</h3>

          <div className="flow-root">
            <div className="-my-12 divide-y divide-gray-200">
              {ownedReview && (
                <ReviewItemWhereOwned
                  setOpen={setOpen}
                  setDeleteReviewModalOpen={setDeleteReviewModalOpen}
                  {...ownedReview}
                />
              )}
              {reviews
                ?.filter((review) => review.id !== ownedReview?.id)
                .map((review) => (
                  <ReviewItem key={review.id} {...review} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
