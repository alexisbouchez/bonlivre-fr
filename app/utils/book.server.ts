import type { Book } from "@prisma/client";
import { db } from "./db.server";

export interface GetBooksQuery {
  search?: string;
  genre?: string;
  language?: string;
  sort?: string;
  page?: number;
}

export async function getBooksAndCount({
  language,
  genre,
  search,
  sort,
  page,
}: GetBooksQuery): Promise<{
  books: Book[];
  count: number;
}> {
  const AND = [];

  if (language && language !== "all") AND.push({ language });
  if (genre && genre !== "all") AND.push({ genre });

  let year: ("asc" | "desc") | undefined = undefined;

  if (sort === "newest") {
    year = "desc";
  }

  if (sort === "oldest") {
    year = "asc";
  }

  const take = 12;

  try {
    const books = await db.book.findMany({
      where: {
        OR: [
          { title: { contains: `%${search}%` } },
          { author: { contains: `%${search}%` } },
        ],
        AND,
      },
      include: { reviews: true, _count: true },
      orderBy: { year },
      take,
      skip: ((page || 1) - 1) * take,
    });

    const count = await db.book.count({
      where: {
        OR: [
          { title: { contains: `%${search}%` } },
          { author: { contains: `%${search}%` } },
        ],
        AND,
      },
    });

    return { books, count };
  } catch {
    return { books: [], count: 0 };
  }
}

export async function getBookById(id: string) {
  try {
    const book = await db.book.findFirst({ where: { id } });

    return book;
  } catch {
    return null;
  }
}

export type AddBookParams = {
  title: string;
  author: string;
  year: number;
  genre: string;
  cover: string;
  language: string;
};

export async function addBook(data: AddBookParams) {
  const bookFoundByTitleAndAuthor = await db.book.findFirst({
    where: {
      title: data.title,
      author: data.author,
    },
  });

  if (bookFoundByTitleAndAuthor) {
    return { book: bookFoundByTitleAndAuthor };
  }

  try {
    const book = await db.book.create({ data });

    return { book };
  } catch {
    return { error: "Erreur interne." };
  }
}
