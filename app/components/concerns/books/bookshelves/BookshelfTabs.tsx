import { Link } from "remix";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface BookshelfTabsProps {
  status: string;
}

const BookshelfTabs: React.FC<BookshelfTabsProps> = ({ status }) => {
  const tabs = [
    {
      name: "À lire",
      href: "/bookshelf/to-read",
      current: status === "to-read",
    },
    {
      name: "En train de lire",
      href: "/bookshelf/reading",
      current: status === "reading",
    },
    { name: "Lu", href: "/bookshelf/read", current: status === "read" },
  ];

  return (
    <div className="border-b border-gray-200 pt-8">
      <div className="sm:flex sm:items-baseline">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Ma bibliothèque
        </h3>
        <div className="mt-4 sm:mt-0 sm:ml-10">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.href}
                className={classNames(
                  tab.current
                    ? "border-opium-500 text-opium-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default BookshelfTabs;
