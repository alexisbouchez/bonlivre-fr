import { Disclosure } from "@headlessui/react";
import { MinusSmIcon, PlusSmIcon } from "@heroicons/react/solid";

interface ExploreBooksFilterProps {
  title: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  selected: string;
  setSelected: (value: string) => void;
}

const ExploreBooksFilter: React.FC<ExploreBooksFilterProps> = ({
  title,
  options,
  selected,
  setSelected,
}) => {
  options = [{ value: "all", label: "Tou(te)s" }, ...options];

  return (
    <div>
      <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
        {({ open }) => (
          <>
            <h3 className="-mx-2 -my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">{title}</span>
                <span className="ml-6 flex items-center">
                  {open ? (
                    <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
              </Disclosure.Button>
            </h3>

            <Disclosure.Panel className="pt-6">
              <div className="space-y-6">
                {options.map(({ value, label }) => (
                  <div key={value} className="flex items-center">
                    <input
                      id={`filter-${value}`}
                      defaultValue={value}
                      type="checkbox"
                      checked={selected === value}
                      className="h-4 w-4 rounded border-gray-300 text-opium-600 focus:ring-opium-500"
                      onChange={() => setSelected(value)}
                    />
                    <label
                      className="ml-3 min-w-0 flex-1 text-gray-500"
                      htmlFor={`filter-${value}`}
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default ExploreBooksFilter;
