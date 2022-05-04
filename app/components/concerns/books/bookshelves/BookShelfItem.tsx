import { useState } from "react";
import { Link } from "remix";
import { BookWithStatus } from "~/utils/bookshelf.server";
import BookshelfActions from "./BookshelfActions";

const BookShelfItem: React.FC<BookWithStatus> = (book) => {
  const [hidden, setHidden] = useState(false);

  return (
    <li
      className={`${
        hidden ? "hidden" : ""
      } flex flex-col border-b py-8 last:border-0 md:flex-row`}
    >
      <Link to={`/books/${book.id}`}>
        <img
          src={book.cover}
          className="mb-8 mr-10 h-96 w-auto cursor-pointer object-contain shadow hover:opacity-75 sm:mb-0 sm:h-60"
        />
      </Link>
      <div className="flex flex-col justify-between">
        <div className="mb-8">
          <h3 className="text-2xl font-bold">{book.title}</h3>
          <p className="text-xl">{book.author}</p>
          <p>{book.year}</p>
        </div>
        <BookshelfActions
          setHidden={setHidden}
          bookId={book.id}
          bookshelfStatus={book.status}
        />
      </div>
    </li>
  );
};

export default BookShelfItem;
