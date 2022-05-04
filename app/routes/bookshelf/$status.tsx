import { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import {
  deleteBookshelfItem,
  getBookshelf,
  updateBookshelfStatus,
} from "~/utils/bookshelf.server";
import { getUserId, requireUserId } from "~/utils/session.server";
import Bookshelf from ".";

export const meta: MetaFunction = () => ({
  title: "Bonlivre - Ma bibliothèque",
});

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await getUserId(request);

  if (!userId) {
    return null;
  }

  const formData = await request.formData();
  const status = formData.get("status");
  const bookId = formData.get("bookId");

  if (!bookId || typeof bookId !== "string") {
    return null;
  }

  if (request.method === "DELETE") {
    await deleteBookshelfItem(userId, bookId);

    return null;
  }

  if (!status || typeof status !== "string") {
    return null;
  }

  const updateSuccess = await updateBookshelfStatus(userId, bookId, status);

  if (!updateSuccess) {
    return null;
  }

  return { status };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { status } = params;
  const userId = await requireUserId(request);
  const bookshelf = await getBookshelf(userId, status);
  return { bookshelf, status };
};

export default Bookshelf;
