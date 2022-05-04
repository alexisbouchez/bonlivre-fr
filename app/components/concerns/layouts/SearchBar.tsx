import { SearchIcon } from "@heroicons/react/solid";
import { Form } from "remix";

interface SearchBarProps {}

const SearchBar: React.FC<SearchBarProps> = () => (
  <Form method="post" className="relative mt-12 rounded-md shadow-sm lg:mx-80">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <SearchIcon className="h-5 w-5 text-opium-400" aria-hidden="true" />
    </div>
    <input
      type="text"
      name="search"
      id="search"
      className="block w-full rounded-md border-opium-200 py-2 pl-10 text-xl focus:border-opium-300 focus:ring-opium-300"
      placeholder="Chercher un livre par titre ou auteur"
    />
    <input type="submit" hidden />
  </Form>
);

export default SearchBar;
