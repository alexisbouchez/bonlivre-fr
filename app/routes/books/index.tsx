import { Book } from "@prisma/client";
import { LoaderFunction, MetaFunction } from "remix";
import { json, useLoaderData } from "remix";
import ExploreBooksGrid from "~/components/concerns/books/ExploreBooksGrid";
import ExploreBooksLayout from "~/components/concerns/books/ExploreBooksLayout";
import { getBooksAndCount } from "~/utils/book.server";

export const meta: MetaFunction = () => {
  return { title: "BonLivre - Rechercher un livre" };
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const genre = url.searchParams.get("genre") || "all";
  const language = url.searchParams.get("language") || "all";
  let sort = url.searchParams.get("sort") || "random";
  const page = parseInt(url.searchParams.get("page") || "1") || 1;

  if (
    sort !== "random" &&
    sort !== "newest" &&
    sort !== "best-rating" &&
    sort !== "oldest"
  ) {
    sort = "random";
  }

  const { books, count } = await getBooksAndCount({
    search,
    genre,
    language,
    sort,
    page,
  });

  return json({ books, count, genre, language, search, sort, page });
};

interface LoaderData {
  books: Book[];
  genre: string;
  language: string;
  search: string;
  sort: string;
  count: number;
  page: number;
}

export default function ExploreBooks() {
  const { books, ...query } = useLoaderData<LoaderData>();

  return (
    <ExploreBooksLayout {...query}>
      <ExploreBooksGrid books={books} />
    </ExploreBooksLayout>
  );
}
