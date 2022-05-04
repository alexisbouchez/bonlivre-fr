import { Book } from "@prisma/client";
import { Link } from "remix";

const BookCard: React.FC<Book> = (book) => (
  <Link key={book.id} to={`/books/${book.id}`} className="group">
    <div className="aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8 flex w-full justify-center overflow-hidden rounded-lg">
      <img
        src={book.cover}
        alt={`${book.title} - ${book.author}`}
        className="h-80 w-48 object-cover object-center shadow group-hover:opacity-75"
      />
    </div>
  </Link>
);

export default BookCard;
