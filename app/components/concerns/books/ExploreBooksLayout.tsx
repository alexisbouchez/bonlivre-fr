import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import {
  ChevronDownIcon,
  FilterIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import { Form, Link } from "remix";
import sortOptions from "~/constants/sort-options";
import genres from "~/constants/genres";
import ExploreBooksFilter from "./ExploreBooksFilter";
import languages from "~/constants/languages";
import ReadOnlyInput from "../../common/forms/ReadOnlyInput";
import Pagination from "./Pagination";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface ExploreBooksLayoutProps {
  genre: string;
  language: string;
  search?: string;
  sort?: string;
  count: number;
  page: number;
}

const ExploreBooksLayout: React.FC<ExploreBooksLayoutProps> = ({
  children,
  search,
  language,
  genre,
  sort,
  count,
  page,
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [selectedGenre, setSelectedGenre] = useState(genre);
  const [mounted, setMounted] = useState(false);
  const [sortingMethod, setSortingMethod] = useState(sort);
  const [currentPage, setCurrentPage] = useState(page || 1);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  });

  useEffect(() => {
    setCurrentPage(page || 1);
  }, [page]);

  useEffect(() => {
    if (mounted) {
      setCurrentPage(1);
    }
  }, [selectedGenre, selectedLanguage, sortingMethod]);

  useEffect(() => {
    if (mounted) {
      formRef?.current?.submit();
    }
  }, [selectedGenre, selectedLanguage, sortingMethod, currentPage]);

  const totalPages = Math.ceil(count / 12);

  return (
    <div className="fullheight bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-40 flex lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4 border-t border-gray-200">
                  <h3 className="sr-only">Filtres</h3>

                  <ExploreBooksFilter
                    title="Genres"
                    options={genres}
                    selected={selectedGenre}
                    setSelected={setSelectedGenre}
                  />

                  <ExploreBooksFilter
                    title="Langues"
                    options={languages}
                    selected={selectedLanguage}
                    setSelected={setSelectedLanguage}
                  />
                </div>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto mb-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 flex items-baseline justify-between border-b border-gray-200 pt-8 pb-6">
            <h1 className="text-lg font-medium leading-6 text-gray-900">
              Explorez les livres
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Trier par
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.value}>
                          {({ active }) => (
                            <a
                              className={classNames(
                                option.value === sortingMethod
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block cursor-pointer px-4 py-2 text-sm"
                              )}
                              onClick={() => setSortingMethod(option.value)}
                            >
                              {option.label}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FilterIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6">
            <h2 id="products-heading" className="sr-only">
              Books
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <div className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>

                <ExploreBooksFilter
                  title="Genres"
                  options={genres}
                  selected={selectedGenre}
                  setSelected={setSelectedGenre}
                />

                <ExploreBooksFilter
                  title="Langues"
                  options={languages}
                  selected={selectedLanguage}
                  setSelected={setSelectedLanguage}
                />
              </div>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <Form className="relative mb-8 pt-2" method="get" ref={formRef}>
                  <ReadOnlyInput name="genre" value={selectedGenre} />
                  <ReadOnlyInput name="language" value={selectedLanguage} />
                  <ReadOnlyInput name="sort" value={sortingMethod} />
                  <ReadOnlyInput name="page" value={currentPage} />

                  <div className="pointer-events-none absolute inset-y-0 left-0 top-2 flex items-center pl-3">
                    <SearchIcon
                      className="h-5 w-5 text-opium-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="text"
                    name="search"
                    className="w-full rounded-lg border-gray-300 py-2 pl-10 text-xl focus:border-opium-50 focus:ring-opium-50"
                    placeholder="Chercher un livre par titre ou auteur"
                    defaultValue={search}
                  />
                  <input type="submit" hidden />
                </Form>

                <Link
                  to="/books/new"
                  className="mb-4 inline-flex items-center rounded-md border border-transparent bg-opium-700 py-2 px-4 text-base font-medium text-white hover:opacity-90"
                >
                  Ajouter un livre
                </Link>

                {children}

                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ExploreBooksLayout;
