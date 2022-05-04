import { Book } from "@prisma/client";
import BookCard from "./BookCard";

interface ExploreBooksGridProps {
  books: Book[];
}

const ExploreBooksGrid: React.FC<ExploreBooksGridProps> = ({ books }) => (
  <div className="bg-white">
    <div className="mx-auto max-w-2xl lg:max-w-7xl">
      <h2 className="sr-only">Books</h2>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {books?.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </div>
    </div>
  </div>
);

export default ExploreBooksGrid;
