import { PencilAltIcon, StarIcon, TrashIcon } from "@heroicons/react/solid";
import { ReviewWithUser } from "~/utils/review.server";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ReviewItem: React.FC<ReviewWithUser> = ({ children, ...review }) => (
  <div className="py-12">
    <div className="flex justify-between">
      <div className="flex items-center">
        {review.user.avatar ? (
          <img
            src={review.user.avatar}
            className="h-12 w-12 rounded-full"
            alt="Avatar"
          />
        ) : (
          <svg
            className="h-12 w-12 rounded-full text-gray-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}

        <div className="ml-4">
          <h4 className="text-sm font-bold text-gray-900">
            {review.user.username}
          </h4>
          <div className="mt-1 flex items-center">
            {[0, 1, 2, 3, 4].map((rating) => (
              <StarIcon
                key={rating}
                className={classNames(
                  review.stars > rating ? "text-yellow-400" : "text-gray-300",
                  "h-5 w-5 flex-shrink-0"
                )}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="sr-only">{review.stars} / 5</p>
        </div>
      </div>

      {children}
    </div>

    <div
      className="mt-4 space-y-6 text-base text-gray-600"
      dangerouslySetInnerHTML={{ __html: review.comment }}
    />
  </div>
);

export default ReviewItem;

interface ReviewItemWhereOwnedProps extends ReviewWithUser {
  setOpen: (_: boolean) => void;
  setDeleteReviewModalOpen: (_: boolean) => void;
}

export const ReviewItemWhereOwned: React.FC<ReviewItemWhereOwnedProps> = ({
  setOpen,
  setDeleteReviewModalOpen,
  ...ownedReview
}) => (
  <ReviewItem {...ownedReview}>
    <div>
      <button onClick={() => setOpen(true)}>
        <PencilAltIcon className="mr-2 h-5 w-5 text-opium-600 hover:text-opium-500" />
      </button>

      <button onClick={() => setDeleteReviewModalOpen(true)}>
        <TrashIcon className="h-5 w-5 cursor-pointer text-red-600 hover:text-red-500" />
      </button>
    </div>
  </ReviewItem>
);
