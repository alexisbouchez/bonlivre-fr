import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import { MetaFunction, LoaderFunction } from "remix";
import styles from "./styles/app.css";
import Header from "./components/concerns/layouts/Header";
import { getUser, getUserId, signOut } from "./utils/session.server";
import Footer from "./components/concerns/layouts/Footer";
import { i18n } from "./utils/i18n.server";
import cover from "./images/cover.png";

export const meta: MetaFunction = () => ({
  title: "BonLivre",
  description: "Sauvegardez, notez et commentez vos lectures",
  "og:image": cover,
  "twitter:image": cover,
  "twitter:card": "summary_large_image",
});

export const links = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap",
  },
];

type LoaderData = {
  isLoggedIn: boolean;
  name?: string;
  locale: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  const isLoggedIn = !!userId;
  const locale = await i18n.getLocale(request);

  if (userId) {
    const user = await getUser(request);

    if (!user) {
      await signOut(request);
      return { isLoggedIn: false };
    }

    const name = user.username;

    return { isLoggedIn, name, locale };
  }

  return { isLoggedIn, locale };
};

export default function App() {
  const loaderData = useLoaderData<LoaderData>();

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <Header {...loaderData} />
          <Outlet />
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
