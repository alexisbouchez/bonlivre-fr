import { ActionFunction } from "remix";
import { Form, useActionData, useTransition } from "remix";
import Field from "~/components/common/forms/Field";
import FormHeader from "~/components/common/forms/FormHeader";
import SubmitButton from "~/components/common/forms/SubmitButton";
import { sendForgotPasswordMail } from "~/utils/sendgrid.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString() || "";

  if (!email) {
    return { error: "Veuillez entrer votre adresse électronique." };
  }

  await sendForgotPasswordMail(email);

  return { success: "Un courriel vous a été envoyé." };
};

export default function ForgotPassword() {
  const transition = useTransition();
  const actionData = useActionData();

  return (
    <div className="fullheight sm:mx-auto sm:w-full sm:max-w-md">
      <FormHeader>Mot de passe oublié ?</FormHeader>

      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <Form className="space-y-6" method="post">
          <Field
            name="email"
            placeholder="jean.dupont@gmail.com"
            error={actionData?.error}
          >
            Adresse électronique
          </Field>

          {actionData?.success && (
            <p className="text-opium-700">{actionData.success}</p>
          )}

          <SubmitButton state={transition.state} />
        </Form>
      </div>
    </div>
  );
}
