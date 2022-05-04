import { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import { useLoaderData } from "remix";
import { BookWithStatus } from "~/utils/bookshelf.server";
import { updateBookshelfStatus } from "~/utils/bookshelf.server";
import BookshelfTabs from "~/components/concerns/books/bookshelves/BookshelfTabs";
import Container from "~/components/concerns/layouts/Container";
import { getBookshelf } from "~/utils/bookshelf.server";
import { getUserId, requireUserId } from "~/utils/session.server";
import BookShelfItem from "~/components/concerns/books/bookshelves/BookShelfItem";

interface LoaderData {
  bookshelf: BookWithStatus[];
  status: string;
}

export const meta: MetaFunction = () => ({
  title: "Bonlivre - Ma bibliothèque",
});

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const bookshelf = await getBookshelf(userId);
  return { bookshelf, status: "to-read" };
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await getUserId(request);

  if (!userId) {
    return null;
  }

  const formData = await request.formData();
  const status = formData.get("status");
  const bookId = formData.get("bookId");

  if (!status || typeof status !== "string") {
    return null;
  }

  if (!bookId || typeof bookId !== "string") {
    return null;
  }

  const updateSuccess = await updateBookshelfStatus(userId, bookId, status);

  if (!updateSuccess) {
    return null;
  }

  return { status };
};

export default function Bookshelf() {
  const loaderData = useLoaderData<LoaderData>();

  return (
    <Container>
      <div className="fullheight">
        <BookshelfTabs status={loaderData.status} />
        {loaderData.bookshelf.length === 0 ? (
          <p className="mt-8 text-green-900">
            Votre bibliothèque est vide pour cet état.
          </p>
        ) : (
          <ul>
            {loaderData.bookshelf.map((book) => (
              <BookShelfItem key={book.id} {...book} />
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
