import { useTransition } from "remix";

type SubmitButtonProps = {
  state?: string;
};

const SubmitButton: React.FC<SubmitButtonProps> = () => {
  const { state } = useTransition();

  let submitButtonClasses =
    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-opium-600 hover:bg-opium-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opium-500";

  if (state === "submitting") {
    submitButtonClasses += " opacity-75";
  }

  return (
    <div>
      <button
        type="submit"
        className={submitButtonClasses}
        disabled={state === "submitting"}
      >
        {state === "submitting" ? "Envoi en cours..." : "Envoyer"}
      </button>
    </div>
  );
};

export default SubmitButton;
