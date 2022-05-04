import { User } from "@prisma/client";
import { UpdateUserInput } from "~/utils/user.server";
import {
  checkEmail,
  checkUsername,
  checkPasswords,
  uploadAvatarHandler,
  deleteUser,
} from "~/utils/user.server";
import { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import {
  Form,
  unstable_parseMultipartFormData,
  useActionData,
  useTransition,
} from "remix";
import { updateUser } from "~/utils/user.server";
import { hash } from "bcryptjs";
import { useLoaderData } from "remix";
import Container from "~/components/concerns/layouts/Container";
import { requireUser, requireUserId, signOut } from "~/utils/session.server";
import { ChangeEvent } from "react";
import { useRef, useState } from "react";
import DeactivateAccountModal from "~/components/concerns/account/DeactivateAccountModal";

export const meta: MetaFunction = () => {
  return { title: "BonLivre - Paramètres" };
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  return user;
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method === "DELETE") {
    const userId = await requireUserId(request);
    await deleteUser(userId);
    return signOut(request);
  }

  const user = await requireUser(request);

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadAvatarHandler
  );
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const username = formData.get("username")?.toString().trim().toLowerCase();
  const password = formData.get("password");
  const confirmationPassword = formData.get("confirmationPassword");
  const avatar = formData.get("avatar");

  const errors = {
    email: await checkEmail(email, user.email),
    username: await checkUsername(username, user.username),
    password: checkPasswords(password, confirmationPassword),
  };

  if (Object.values(errors).some((error) => error)) {
    return { errors };
  }

  const updateUserInput: UpdateUserInput = {
    email,
    username,
    password: password ? await hash(password.toString(), 10) : undefined,
    avatar: typeof avatar === "string" ? avatar : undefined,
  };

  const updateSucceed = await updateUser(user.id, updateUserInput);

  if (updateSucceed) {
    return { success: "Vos informations ont bien été mises à jour." };
  }

  return { errors: { other: "La mise à jour de vos informations a échoué." } };
};

interface ActionData {
  success?: string;
  errors?: {
    email?: string;
    username?: string;
    password?: string;
    other?: string;
  };
}

export default function Settings() {
  const user = useLoaderData<User>();
  const actionData = useActionData<ActionData>();
  const transition = useTransition();
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [deactivateAccountModalOpen, setDeactivateAccountModalOpen] =
    useState<boolean>(false);

  const onClickDeactivateAccount = () => {
    setDeactivateAccountModalOpen(true);
  };

  const onAvatarButtonClick = () => {
    avatarRef.current?.click();
  };

  const onAvatarInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files?.length === 0) {
      return;
    }

    const file = event.target.files[0];

    if (!file.type.startsWith("image/")) {
      return;
    }

    setAvatar(URL.createObjectURL(file));
  };

  const onCancelButtonClick = () => {
    setAvatar(null);
  };

  return (
    <Container>
      <Form
        method="post"
        className="fullheight space-y-8 divide-y divide-gray-200 py-8"
        encType="multipart/form-data"
      >
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <h3 className="border-b pb-4 text-lg font-medium leading-6 text-gray-900">
                Paramètres
              </h3>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Addresse électronique{" "}
                  <span className="text-red-500">(requis)</span>
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-opium-500 focus:ring-opium-500 sm:text-sm"
                    placeholder="jean.dupont@gmail.com"
                    defaultValue={user.email}
                  />
                </div>
              </div>

              {actionData?.errors?.email && (
                <div className="sm:col-span-6">
                  <p className="text-red-500">{actionData.errors.email}</p>
                </div>
              )}

              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom d'utilisateur{" "}
                  <span className="text-red-500">(requis)</span>
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-opium-500 focus:ring-opium-500 sm:text-sm"
                    placeholder="jean_dupont"
                    defaultValue={user.username}
                  />
                </div>
              </div>

              {actionData?.errors?.username && (
                <div className="sm:col-span-6">
                  <p className="text-red-500">{actionData.errors.username}</p>
                </div>
              )}

              <div className="sm:col-span-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nouveau mot de passe
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="off"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-opium-500 focus:ring-opium-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="confirmationPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmez le nouveau mot de passe
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="password"
                    name="confirmationPassword"
                    id="confirmationPassword"
                    autoComplete="off"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-opium-500 focus:ring-opium-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {actionData?.errors?.password && (
                <div className="sm:col-span-6">
                  <p className="text-red-500">{actionData.errors.password}</p>
                </div>
              )}

              <div className="sm:col-span-6">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Avatar
                </label>

                <div className="mt-1 flex items-center">
                  <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                    {avatar || user.avatar ? (
                      <img src={avatar || user.avatar || ""} alt="Avatar" />
                    ) : (
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </span>
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    ref={avatarRef}
                    onChange={onAvatarInputChange}
                    hidden
                  />
                  <button
                    type="button"
                    className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-opium-500 focus:ring-offset-2"
                    onClick={onAvatarButtonClick}
                  >
                    Changer
                  </button>
                </div>
              </div>

              {actionData?.success && (
                <div className="sm:col-span-6">
                  <p className="text-opium-500">{actionData.success}</p>
                </div>
              )}

              {actionData?.errors?.other && (
                <div className="sm:col-span-6">
                  <p className="text-red-500">{actionData.errors.other}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex">
            <button
              type="reset"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-opium-500 focus:ring-offset-2"
              onClick={onCancelButtonClick}
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`ml-3 inline-flex justify-center rounded-md border border-transparent bg-opium-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opium-700 focus:outline-none focus:ring-2 focus:ring-opium-500 focus:ring-offset-2 ${
                transition.state === "submitting" && "opacity-75"
              }`}
            >
              {transition.state === "submitting"
                ? "Enregistrement en cours..."
                : "Enregistrer"}
            </button>
          </div>
        </div>

        <button
          type="button"
          className={`inline-flex justify-center rounded-md bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
          onClick={onClickDeactivateAccount}
        >
          Désactiver mon compte
        </button>

        <DeactivateAccountModal
          open={deactivateAccountModalOpen}
          setOpen={setDeactivateAccountModalOpen}
        />
      </Form>
    </Container>
  );
}
