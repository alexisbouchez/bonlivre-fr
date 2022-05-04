import { Menu, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon, TrashIcon } from "@heroicons/react/solid";
import { Fragment } from "react";
import { Form } from "remix";
import ReadOnlyInput from "../../../common/forms/ReadOnlyInput";

type BookshelfActionProps = {
  bookshelfStatus?: string;
  status: string;
  bookId?: string;
  value: string;
  setHidden?: (_: boolean) => void;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const BookshelfAction: React.FC<BookshelfActionProps> = ({
  bookshelfStatus,
  status,
  value,
  bookId,
  setHidden,
}) => {
  let buttonClassnames =
    "relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-opium-500 focus:border-opium-500";

  if (value === "to-read") {
    buttonClassnames += " rounded-l-md";
  }

  if (value === "reading" || (!bookshelfStatus && value === "read")) {
    buttonClassnames += " -ml-px";
  }

  if (value === "remove" || (!bookshelfStatus && value === "read")) {
    buttonClassnames += " rounded-r-md";
  }

  const handleClick = () => {
    if (bookshelfStatus === value) {
      return;
    }

    if (setHidden) {
      setHidden(true);
    }
  };

  return (
    <Form method={value === "remove" ? "delete" : "post"}>
      <ReadOnlyInput name="bookId" value={bookId} />
      <ReadOnlyInput name="status" value={value} />
      <ReadOnlyInput name="_action" value="bookshelf" />

      {value !== "remove" && (
        <button
          type="submit"
          className={buttonClassnames}
          onClick={handleClick}
        >
          {status}
          {bookshelfStatus === value && <CheckIcon className="h-4 pl-2" />}
        </button>
      )}

      {value === "remove" && (
        <Menu as="div" className={buttonClassnames}>
          <Menu.Button
            type="button"
            className={`flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-opium-500 focus:ring-offset-2 focus:ring-offset-gray-100`}
          >
            <span className="sr-only">Open options</span>
            <ChevronDownIcon className="-mx-2 h-5 w-5" aria-hidden="true" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute top-5 right-0 mt-4 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="submit"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "flex w-full items-center px-4 py-2 text-left text-sm"
                      )}
                    >
                      <TrashIcon
                        className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600"
                        aria-hidden="true"
                      />
                      Supprimer de ma bibliothèque
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    </Form>
  );
};

type BookshelfActionsProps = {
  bookshelfStatus?: string;
  bookId?: string;
  setHidden?: (_: boolean) => void;
};

const BookshelfActions: React.FC<BookshelfActionsProps> = ({
  bookshelfStatus,
  bookId,
  setHidden,
}) => (
  <span className="relative z-0 inline-flex rounded-md pt-10 shadow-sm">
    <BookshelfAction
      bookshelfStatus={bookshelfStatus}
      status="À lire"
      value="to-read"
      bookId={bookId}
      setHidden={setHidden}
    />
    <BookshelfAction
      bookshelfStatus={bookshelfStatus}
      status="En train de lire"
      value="reading"
      bookId={bookId}
      setHidden={setHidden}
    />
    <BookshelfAction
      bookshelfStatus={bookshelfStatus}
      status="Lu"
      value="read"
      bookId={bookId}
      setHidden={setHidden}
    />
    {bookshelfStatus && (
      <BookshelfAction
        bookshelfStatus={bookshelfStatus}
        status="Remove"
        value="remove"
        bookId={bookId}
        setHidden={setHidden}
      />
    )}
  </span>
);

export default BookshelfActions;
