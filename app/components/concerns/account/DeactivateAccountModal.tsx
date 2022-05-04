import DangerModal from "../../common/modals/DangerModal";

export interface DeactivateAccountModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DeactivateAccountModal: React.FC<DeactivateAccountModalProps> = ({
  open,
  setOpen,
}) => (
  <DangerModal
    open={open}
    setOpen={setOpen}
    title="Désactiver mon compte"
    description="Êtes-vous sûr de vouloir désactiver votre compte ? Toutes vos données seront supprimées. Cette action est irréversible."
    action="Désactiver"
  />
);

export default DeactivateAccountModal;
