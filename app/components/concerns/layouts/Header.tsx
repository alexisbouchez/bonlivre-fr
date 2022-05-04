import { Link } from "remix";
import AccountMenu from "../account/AccountMenu";

type NavigationItem = { path: string; text: string };

const navigation: NavigationItem[] = [
  { path: "/", text: "Accueil" },
  { path: "/books", text: "Livres" },
];

type HeaderProps = {
  isLoggedIn: boolean;
  name?: string;
};

const Header: React.FC<HeaderProps> = ({ isLoggedIn, name }) => (
  <header className="bg-opium-600">
    <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
      <div className="flex w-full items-center justify-between border-b border-opium-500 py-6 lg:border-none">
        <div className="flex items-center">
          <Link to="/">
            <span className="sr-only">Workflow</span>
            <span className="font-serif text-2xl font-bold text-white hover:text-opium-50">
              BonLivre
            </span>
          </Link>
          <div className="ml-10 hidden space-x-8 lg:block">
            {navigation.map(({ path, text }) => (
              <Link
                to={path}
                className="font-medium text-white hover:text-opium-50"
                key={path}
              >
                {text}
              </Link>
            ))}
          </div>
        </div>
        {isLoggedIn ? (
          <AccountMenu name={name} />
        ) : (
          <div className="ml-10 flex justify-center space-x-4">
            <Link
              to="/sign-in"
              className="inline-block rounded-md border border-transparent bg-opium-500 py-2 px-4 text-base font-medium text-white hover:bg-opacity-75"
            >
              Connexion
            </Link>
            <Link
              to="/sign-up"
              className="inline-block rounded-md border border-transparent bg-white py-2 px-4 text-base font-medium text-opium-600 hover:bg-opium-50"
            >
              Inscription
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-center space-x-6 py-4 lg:hidden">
        {navigation.map(({ path, text }) => (
          <Link to={path} className="font-medium text-white" key={path}>
            {text}
          </Link>
        ))}
      </div>
    </nav>
  </header>
);

export default Header;
