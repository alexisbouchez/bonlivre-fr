import { Book } from "@prisma/client";
import { ActionFunction, MetaFunction } from "remix";
import {
  Form,
  redirect,
  unstable_parseMultipartFormData,
  useActionData,
} from "remix";
import Container from "~/components/concerns/layouts/Container";
import Field from "~/components/common/forms/Field";
import SelectField from "~/components/common/forms/SelectField";
import FormHeader from "~/components/common/forms/FormHeader";
import SubmitButton from "~/components/common/forms/SubmitButton";
import genres from "~/constants/genres";
import languages from "~/constants/languages";
import { AddBookParams } from "~/utils/book.server";
import { addBook } from "~/utils/book.server";
import { uploadHandler } from "~/utils/cloudinary.server";

export const meta: MetaFunction = () => {
  return { title: "BonLivre - Ajouter un livre" };
};

function areStrings(...params: any[]): boolean {
  for (const param of params) {
    if (typeof param !== "string" || !param) {
      return false;
    }
  }

  return true;
}

type ActionData = {
  book?: Book;
  error?: string;
  fields?: any;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const title = formData.get("title");
  const author = formData.get("author");
  let year: any = formData.get("year");
  const genre = formData.get("genre");
  const cover = formData.get("cover");
  const language = formData.get("language");

  const fields = { title, author, year, genre };

  if (!areStrings(title, author, year, genre, cover, language)) {
    return { error: "Le formulaire est invalide.", fields };
  }

  year = parseInt(year as string);

  if (!year) {
    return { error: "L'année de publication est invalide." };
  }

  const currentYear = new Date().getFullYear();

  if (year > currentYear) {
    return { error: "L'année de publication est invalide." };
  }

  const bookData = {
    title,
    author,
    year,
    genre,
    cover,
    language,
  } as AddBookParams;

  const { book } = await addBook(bookData);

  if (book) {
    return redirect(`/books/${book.id}`);
  }
};

export default function NewBook() {
  const actionData = useActionData<ActionData>();

  return (
    <Container>
      <div className="fullheight sm:mx-auto sm:w-full sm:max-w-xl">
        <FormHeader>Ajouter un livre</FormHeader>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form method="post" action="/books/new" encType="multipart/form-data">
            <Field type="text" name="title" placeholder="Du côté de chez Swann">
              Titre
            </Field>
            <Field type="text" name="author" placeholder="Marcel Proust">
              Auteur
            </Field>
            <Field type="number" name="year" placeholder="1913">
              Année de publication
            </Field>
            <SelectField name="genre" label="Genres">
              {genres.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectField>
            <SelectField label="Langue" name="language">
              {languages.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectField>
            <Field type="file" name="cover">
              Couverture
            </Field>

            {actionData?.error && (
              <p className="text-red-600">{actionData?.error}</p>
            )}

            <div className="mt-4">
              <SubmitButton />
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
}
