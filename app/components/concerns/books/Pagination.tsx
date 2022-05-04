import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/solid";

interface PaginationLinkProps {
  isCurrent?: boolean;
  onClick: () => void;
}

const PaginationLink: React.FC<PaginationLinkProps> = ({
  children,
  isCurrent,
  onClick,
}) => {
  let classNames =
    "cursor-pointer border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium";

  if (isCurrent) {
    classNames +=
      " border-opium-500 text-opium-600 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium";
  }

  return (
    <a onClick={onClick} className={classNames}>
      {children}
    </a>
  );
};

const PreviousLink: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="-mt-px flex w-0 flex-1">
    <a
      className="inline-flex cursor-pointer items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
      onClick={onClick}
    >
      <ArrowNarrowLeftIcon
        className="mr-3 h-5 w-5 text-gray-400"
        aria-hidden="true"
      />
      Précédent
    </a>
  </div>
);

const NextLink: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="-mt-px flex w-0 flex-1 justify-end">
    <a
      onClick={onClick}
      className="inline-flex cursor-pointer items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
    >
      Suivant
      <ArrowNarrowRightIcon
        className="ml-3 h-5 w-5 text-gray-400"
        aria-hidden="true"
      />
    </a>
  </div>
);

interface PaginationProps {
  totalPages?: number;
  currentPage: number;
  setCurrentPage: (_: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const handleSwitchPrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSwitchNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSwitchPage = (page: number) => {
    setCurrentPage(page);
  };

  if (!currentPage) {
    currentPage = 1;
  }

  if (!totalPages) {
    totalPages = 1;
  }

  return (
    <nav className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      {currentPage === 1 ? (
        <div className="-mt-px flex w-0 flex-1" />
      ) : (
        <PreviousLink onClick={handleSwitchPrevious} />
      )}
      <div className="hidden md:-mt-px md:flex">
        {(currentPage || 1) - 1 !== 0 && (
          <PaginationLink
            onClick={() => handleSwitchPage((currentPage || 1) - 1)}
          >
            {(currentPage || 1) - 1}
          </PaginationLink>
        )}
        <PaginationLink
          isCurrent={true}
          onClick={() => handleSwitchPage(currentPage || 1)}
        >
          {currentPage || 1}
        </PaginationLink>
        {(currentPage || 1) + 1 <= (totalPages || 1) && (
          <PaginationLink onClick={() => handleSwitchPage(currentPage + 1)}>
            {currentPage + 1}
          </PaginationLink>
        )}
      </div>
      {totalPages !== currentPage ? (
        <NextLink onClick={handleSwitchNext} />
      ) : (
        <div className="-mt-px flex w-0 flex-1" />
      )}
    </nav>
  );
};

export default Pagination;
