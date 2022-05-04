export interface Genre {
  value: string;
  label: string;
}

const genres: Genre[] = [
  {
    value: "history",
    label: "Histoire",
  },
  {
    value: "philosophy",
    label: "Philosophie",
  },
  {
    value: "psychology",
    label: "Psychologie",
  },
  {
    value: "self-help",
    label: "Développement personnel",
  },
  {
    value: "religion",
    label: "Religion",
  },
  {
    value: "literature",
    label: "Littérature",
  },
  {
    value: "biography",
    label: "Biographie",
  },
  {
    value: "autobiography",
    label: "Autobiographie",
  },
  {
    value: "politics",
    label: "Politique",
  },
  {
    value: "mythology",
    label: "Mythologie",
  },
  {
    value: "sciences",
    label: "Sciences",
  },
];

genres.sort((a, b) => a.label.localeCompare(b.label));

export default genres;

export function getGenreLabelFromValue(value?: string): string {
  if (!value) return "";
  const genre = genres.find((g) => g.value === value);
  return genre ? genre.label : "";
}
