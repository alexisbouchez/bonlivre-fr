import * as React from "react";
import { SearchIcon } from "@heroicons/react/solid";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import type { GoogleBooksApiBook } from "~/utils/google-books-api";
import { useFetcher } from "@remix-run/react";

interface ImportBookPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ImportBookPalette: React.FC<ImportBookPaletteProps> = ({
  open,
  setOpen,
}) => {
  const [query, setQuery] = React.useState("");

  const fetcher = useFetcher();
  const newBookfetcher = useFetcher();

  const [books, setBooks] = React.useState<GoogleBooksApiBook[] | null>(null);

  const handleUpdateQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    fetcher.load(`/books/new?query=${query}`);
  };

  React.useEffect(() => {
    if (fetcher?.data?.books && fetcher?.data.books.length > 0) {
      setBooks(fetcher.data.books);
    }
  }, [fetcher]);

  const handleSubmitNewBook = (book: GoogleBooksApiBook) => {
    try {
      const formData = new FormData();
      formData.append("title", book.title);
      formData.append("author", book.author);
      formData.append("year", book.year);
      formData.append("cover", book.cover);
      formData.append("language", book.language);
      formData.append("genre", book.genre);

      newBookfetcher.submit(formData, {
        action: "/books/new?google=true",
        method: "post",
        encType: "multipart/form-data",
      });
    } catch {}
  };

  return (
    <>
      <newBookfetcher.Form
        action="/books/new"
        method="post"
        encType="multipart/form-data"
      />
      <Transition.Root
        show={open}
        as={React.Fragment}
        afterLeave={() => setQuery("")}
        appear
      >
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-hidden p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                <Combobox onChange={handleSubmitNewBook}>
                  <fetcher.Form className="relative" method="get">
                    <SearchIcon
                      className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Combobox.Input
                      autoComplete="off"
                      name="query"
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Recherchez un livre..."
                      onChange={handleUpdateQuery}
                      onKeyDown={(event: any) => {
                        if (event.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                  </fetcher.Form>

                  {books !== null && books.length > 0 && (
                    <Combobox.Options
                      static
                      className="max-h-72 scroll-py-2 overflow-hidden py-2 text-sm text-gray-800"
                    >
                      {books.map((book, key) => (
                        <Combobox.Option
                          key={key}
                          value={book}
                          className={({ active }) =>
                            classNames(
                              "cursor-default select-none px-4 py-2",
                              active ? "bg-emerald-900 text-white" : ""
                            )
                          }
                        >
                          {book.title} - {book.author}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  )}

                  {query !== "" && books === null && (
                    <p className="p-4 text-sm text-gray-500">
                      Tapez sur entrée pour lancer la recherche.
                    </p>
                  )}

                  {query !== "" && books && books.length === 0 && (
                    <p className="p-4 text-sm text-gray-500">
                      Aucun livre correspondant à votre recherche.
                    </p>
                  )}
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default ImportBookPalette;
