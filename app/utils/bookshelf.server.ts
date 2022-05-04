import { Book } from "@prisma/client";
import { db } from "./db.server";

export async function getBookshelfStatus(userId: string, bookId: string) {
  try {
    const bookshelfItem = await db.bookShelfItem.findFirst({
      where: { userId, bookId },
    });

    if (!bookshelfItem) return null;

    return bookshelfItem.status;
  } catch (error) {
    return null;
  }
}

export async function updateBookshelfStatus(
  userId: string,
  bookId: string,
  status: string
) {
  try {
    const bookshelfItem = await db.bookShelfItem.findFirst({
      where: { userId, bookId },
    });

    if (bookshelfItem) {
      await db.bookShelfItem.update({
        data: { status },
        where: { id: bookshelfItem.id },
      });
    } else {
      await db.bookShelfItem.create({
        data: { userId, bookId, status },
      });
    }

    return true;
  } catch {
    return false;
  }
}

export interface BookWithStatus extends Book {
  status: string;
}

export async function getBookshelf(
  userId: string,
  status: string = "to-read"
): Promise<BookWithStatus[]> {
  try {
    const bookshelfItems = await db.bookShelfItem.findMany({
      where: { userId, status },
    });

    const bookshelf: BookWithStatus[] = [];

    for await (const bookshelfItem of bookshelfItems) {
      const book = (await db.book.findFirst({
        where: { id: bookshelfItem.bookId },
      })) as BookWithStatus;

      if (book) {
        book.status = bookshelfItem.status;
        bookshelf.push(book);
      }
    }

    return bookshelf;
  } catch (error) {
    return [];
  }
}

export async function deleteBookshelfItem(userId: string, bookId: string) {
  try {
    await db.bookShelfItem.deleteMany({
      where: { userId, bookId },
    });
  } catch {}
}
