import { ExclamationIcon } from "@heroicons/react/solid";
import { ModalBaseProps } from "./Modal";
import Modal from "./Modal";

export interface DangerModalProps extends ModalBaseProps {
  description: string;
}

const DangerModal: React.FC<DangerModalProps> = ({ description, ...rest }) => (
  <Modal
    {...rest}
    icon={
      <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
    }
    color="red"
    method="delete"
  >
    <p className="text-sm text-gray-500">{description}</p>
  </Modal>
);

export default DangerModal;
