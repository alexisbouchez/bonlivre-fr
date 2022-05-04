import { hash } from "bcryptjs";
import { ActionFunction } from "remix";
import { Form, useActionData } from "remix";
import Field from "~/components/common/forms/Field";
import FormHeader from "~/components/common/forms/FormHeader";
import SubmitButton from "~/components/common/forms/SubmitButton";
import { getUserById } from "~/utils/session.server";
import {
  checkPasswords,
  getUserIdFromPasswordResetToken,
  updateUser,
} from "~/utils/user.server";

export const action: ActionFunction = async ({
  request,
  params: { token },
}) => {
  const userId = getUserIdFromPasswordResetToken(token);
  if (!userId) {
    return { error: "Token invalide" };
  }

  const user = await getUserById(userId);
  if (!user) {
    return { error: "Token invalide" };
  }

  const formData = await request.formData();
  const password = formData.get("password")?.toString() || "";
  const confirmationPassword =
    formData.get("confirmationPassword")?.toString() || "";

  const passwordError = checkPasswords(password, confirmationPassword);
  if (passwordError) {
    return { error: passwordError };
  }

  const hashedPassword = await hash(password, 10);
  const updateSucceed = await updateUser(user.id, { password: hashedPassword });
  if (!updateSucceed) {
    return { error: "Erreur lors de la mise à jour du mot de passe" };
  }

  return { success: "Mot de passe mise à jour" };
};

export default function ResetPassword() {
  const actionData = useActionData();

  return (
    <div className="fullheight sm:mx-auto sm:w-full sm:max-w-md">
      <FormHeader>Réinitialisez votre mot de passe</FormHeader>

      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <Form method="post">
          <Field type="password" name="password" placeholder="••••••••••••••••">
            Mot de passe
          </Field>
          <Field
            type="password"
            name="confirmationPassword"
            placeholder="••••••••••••••••"
          >
            Mot de passe de confirmation
          </Field>
          {actionData?.error && (
            <p className="text-red-500">{actionData.error}</p>
          )}
          {actionData?.success && (
            <p className="text-opium-700">{actionData.success}</p>
          )}
          <SubmitButton />
        </Form>
      </div>
    </div>
  );
}
