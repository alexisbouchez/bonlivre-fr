export interface Language {
  value: string;
  label: string;
}

const languages: Language[] = [
  {
    value: "english",
    label: "Anglais",
  },
  {
    value: "french",
    label: "Français",
  },
];

languages.sort((a, b) => a.label.localeCompare(b.label));

export default languages;
