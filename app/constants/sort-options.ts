export interface SortOption {
  value?: string;
  label?: string;
}

const sortOptions: SortOption[] = [
  { value: "random", label: "Aléatoire" },
  { value: "newest", label: "Nouveauté" },
  { value: "oldest", label: "Ancienneté" },
];

export default sortOptions;
