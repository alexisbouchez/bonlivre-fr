import { ScaleIcon } from "@heroicons/react/outline";
import { Review } from "@prisma/client";
import ReadOnlyInput from "~/components/common/forms/ReadOnlyInput";
import StarsSelect from "~/components/common/forms/StarsSelect";
import Modal from "~/components/common/modals/Modal";

type NewReviewModalProps = {
  open: boolean;
  setOpen: (_: boolean) => void;
  ownedReview?: Review;
};

const NewReviewModal: React.FC<NewReviewModalProps> = ({
  ownedReview,
  ...rest
}) => (
  <Modal
    icon={<ScaleIcon className="h-6 w-6 text-opium-600" aria-hidden="true" />}
    color="opium"
    method="post"
    title={ownedReview ? "Modifier mon commentaire" : "Écrire un commentaire"}
    action="Envoyer"
    {...rest}
  >
    <ReadOnlyInput name="_action" value="review" />

    <StarsSelect defaultValue={ownedReview?.stars || 1} />

    <textarea
      id="comment"
      name="comment"
      placeholder="Qu'avez-vous pensé de ce livre ?"
      required
      className="mt-4 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-opium-500 focus:outline-none focus:ring-opium-500 sm:text-sm"
      defaultValue={ownedReview?.comment || ""}
    ></textarea>
  </Modal>
);

export default NewReviewModal;
