import type { Book } from "@prisma/client";
import Container from "~/components/concerns/layouts/Container";
import Field from "~/components/common/forms/Field";
import SelectField from "~/components/common/forms/SelectField";
import FormHeader from "~/components/common/forms/FormHeader";
import SubmitButton from "~/components/common/forms/SubmitButton";
import genres from "~/constants/genres";
import languages from "~/constants/languages";
import type { AddBookParams } from "~/utils/book.server";
import { addBook } from "~/utils/book.server";
import { uploadHandler } from "~/utils/cloudinary.server";
import { searchBooks } from "~/utils/google-books-api";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import ImportBookPalette from "~/components/concerns/books/ImportBookPalette";
import * as React from "react";

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

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || "";

  if (!query) {
    return null;
  }

  const books = await searchBooks(query);

  return { books };
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

  const [open, setOpen] = React.useState(false);

  return (
    <Container>
      <div className="fullheight sm:mx-auto sm:w-full sm:max-w-xl">
        <FormHeader>Ajouter un livre</FormHeader>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <button
            className="flex w-full items-center justify-center space-x-4 rounded-md border border-transparent bg-opium-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opium-700 focus:outline-none focus:ring-2 focus:ring-opium-500 focus:ring-offset-2"
            onClick={() => setOpen(!open)}
          >
            Importer depuis Google Livres
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-google ml-2"
              viewBox="0 0 16 16"
            >
              <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
            </svg>
          </button>
          <ImportBookPalette open={open} setOpen={setOpen} />
        </div>

        <div className="my-10 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form
            className="flex flex-col space-y-2"
            method="post"
            action="/books/new"
            encType="multipart/form-data"
          >
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
