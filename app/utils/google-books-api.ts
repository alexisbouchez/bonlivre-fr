export type GoogleBooksApiBook = {
  title: string;
  author: string;
  year: string;
};

export async function searchBooks(
  query: string,
  maxResults: number = 10
): Promise<GoogleBooksApiBook[]> {
  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY!;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    const books: GoogleBooksApiBook[] = [];

    for (const item of data.items) {
      const book = item.volumeInfo;
   
      if (!book.title || !book.authors || !book.authors[0] || !book.publishedDate) {
        continue;
      }

      books.push({
        title: item.volumeInfo.title,
        author: book.authors?.join(", "),
        year: book.publishedDate.split("-")[0],
      });
    }

    return books;
  } catch {
    return [];
  }
}
