import DangerModal from "~/components/common/modals/DangerModal";

export interface DeleteReviewModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  reviewId: string;
}

const DeleteReviewModal: React.FC<DeleteReviewModalProps> = ({
  open,
  setOpen,
  reviewId,
}) => (
  <DangerModal
    open={open}
    setOpen={setOpen}
    title="Supprimer mon avis"
    description="Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible."
    action="Supprimer"
    readonlyInputs={[{ name: "reviewId", value: reviewId }]}
  />
);

export default DeleteReviewModal;
