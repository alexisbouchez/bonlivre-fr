import { ActionFunction, MetaFunction } from "remix";
import { redirect } from "remix";
import Hero from "~/components/concerns/landing/Hero";

export const meta: MetaFunction = () => {
  return {
    title: "BonLivre - Accueil",
    description: "Notez, commentez et sauvegardez vos lectures !",
  };
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return null;
  }

  const formData = await request.formData();
  const search = formData.get("search");

  if (!search || typeof search !== "string") {
    return null;
  }

  return redirect(`/books?search=${search}`);
};

export default function Index() {
  return <Hero />;
}
