import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Link } from "@remix-run/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface AccountMenuProps {
  name?: string;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ name }) => (
  <Menu as="div" className="relative inline-block text-left">
    {({ open }) => (
      <>
        <div>
          <Menu.Button className="inline-flex items-center rounded-md border border-transparent bg-opium-500 py-2 px-4 text-base font-medium text-white hover:bg-opacity-75">
            Compte
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          show={open}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            static
            className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="px-4 py-3">
              <p className="text-sm">Connecté en tant que </p>
              <p className="truncate text-sm font-medium text-gray-900">
                {name}
              </p>
            </div>
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/bookshelf"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Ma bibliothèque
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/settings"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Paramètres
                  </Link>
                )}
              </Menu.Item>
            </div>
            <div className="py-1">
              <form method="post" action="/sign-out">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="submit"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block w-full px-4 py-2 text-left text-sm"
                      )}
                    >
                      Déconnexion
                    </button>
                  )}
                </Menu.Item>
              </form>
            </div>
          </Menu.Items>
        </Transition>
      </>
    )}
  </Menu>
);

export default AccountMenu;
