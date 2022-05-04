import { ActionFunction, MetaFunction } from "remix";
import { Form, Link, useActionData } from "remix";
import Field from "~/components/common/forms/Field";
import FormHeader from "~/components/common/forms/FormHeader";
import SubmitButton from "~/components/common/forms/SubmitButton";
import { AuthCredentials } from "~/utils/auth.server";
import { signIn } from "~/utils/auth.server";
import { createUserSession } from "~/utils/session.server";

export const meta: MetaFunction = () => ({
  title: "BonLivre - Connexion",
  description: "Connectez-vous à votre compte.",
});

type ActionData = {
  error?: string;
  fields?: Partial<AuthCredentials>;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      fields: { email, password },
      error: "Vos identifiants de connexion sont invalides.",
    };
  }

  const signInData = { email, password };
  const signedInUser = await signIn(signInData);

  if (signedInUser) {
    return createUserSession(signedInUser.id, "/");
  }

  return {
    fields: signInData,
    error: "Vos identifiants de connexion sont invalides.",
  };
};

export default function SignIn() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="fullheight sm:mx-auto sm:w-full sm:max-w-md">
      <FormHeader>Connexion</FormHeader>
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <Form className="space-y-6" method="post">
          <Field
            type="email"
            name="email"
            required
            placeholder="jean.dupont@example.com"
          >
            Adresse électronique
          </Field>
          <Field
            type="password"
            name="password"
            required
            placeholder="••••••••••••••••"
          >
            Mot de passe
          </Field>

          <div className="flex items-center justify-between">
            <div />

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-opium-600 hover:text-opium-500"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          {actionData?.error && (
            <p style={{ color: "red" }}>{actionData.error}</p>
          )}

          <SubmitButton />
        </Form>
      </div>
    </div>
  );
}
