import { ActionFunction, MetaFunction } from "remix";
import { Form, json, useActionData } from "remix";
import Field from "~/components/common/forms/Field";
import FormHeader from "~/components/common/forms/FormHeader";
import SubmitButton from "~/components/common/forms/SubmitButton";
import { SignUpData, SignUpErrors } from "~/utils/auth.server";
import { signUp } from "~/utils/auth.server";
import { createUserSession } from "~/utils/session.server";
import { checkEmail, checkPassword, checkUsername } from "~/utils/user.server";

export const meta: MetaFunction = () => {
  return {
    title: "BonLivre - Inscription",
    description: "Inscrivez-vous à notre plateforme.",
  };
};

type ActionData = {
  errors?: SignUpErrors;
  fields?: {
    email: any;
    username: any;
    password: any;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const email = formData.get("email")?.toString().trim().toLowerCase();
  const username = formData.get("username")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !username || !password) {
    return badRequest({
      fields: { email, username, password },
      errors: { unkownError: "true" },
    });
  }

  const errors: SignUpErrors = {
    email: await checkEmail(email),
    username: await checkUsername(username),
    password: checkPassword(password),
  };

  const signUpData: SignUpData = { email, username, password };

  if (Object.values(errors).some((error) => error)) {
    return badRequest({ fields: signUpData, errors });
  }

  const [signUpErrors, signedUpUser] = await signUp(signUpData);

  if (signUpErrors) {
    return badRequest({ fields: signUpData, errors: signUpErrors });
  }

  return createUserSession(signedUpUser.id, "/");
};

export default function SignUp() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="fullheight sm:mx-auto sm:w-full sm:max-w-md">
      <FormHeader>Inscription</FormHeader>
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <Form className="space-y-6" method="post">
          <Field
            type="email"
            name="email"
            required
            placeholder="jean.dupont@example.com"
            error={actionData?.errors?.email}
          >
            Adresse électronique
          </Field>
          <Field
            type="text"
            name="username"
            required
            placeholder="jean_dupont"
            error={actionData?.errors?.username}
          >
            Nom d'utilisateur
          </Field>
          <Field
            type="password"
            name="password"
            required
            placeholder="••••••••••••••••"
            error={actionData?.errors?.password}
          >
            Mot de passe
          </Field>
          <SubmitButton />
        </Form>
      </div>
    </div>
  );
}
