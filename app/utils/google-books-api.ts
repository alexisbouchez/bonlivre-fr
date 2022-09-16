const apiKey: string = "AIzaSyCtdejEEzeY6V2wzNxzIDz-I6_blYafUlE";

export async function searchBooks(
  query: string,
  maxResults: number = 10
): Promise<any[]> {
  try {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log("data", data);

  return data.items?.map((item: any) => {
    const book = item.volumeInfo;

    return {
      title: book.title,
    };
  }) || [];
  } catch {
    return [];
  }
}
