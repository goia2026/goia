import type { Locale } from "@/lib/menu-data";

export type ChichaFlavorType = "signature" | "classique";
export type ChichaFlavorBadge = "best-seller" | "signature" | "";

export type ChichaFlavor = {
  id: string;
  type: ChichaFlavorType;
  name: Record<Locale, string>;
  notes: Record<Locale, string>;
  badge?: ChichaFlavorBadge;
  available?: boolean;
  position: number;
};

const emptyLocaleRecord: Record<Locale, string> = { fr: "", de: "", en: "" };

export const initialChichaFlavors: ChichaFlavor[] = [
  {
    id: "black-nana",
    type: "signature",
    name: { fr: "Black Nana", de: "Black Nana", en: "Black Nana" },
    notes: {
      fr: "Menthe fraîche • Raisin noir",
      de: "Frische Minze • Schwarze Traube",
      en: "Fresh mint • Black grape"
    },
    position: 1,
    available: true
  },
  {
    id: "mi-amor",
    type: "signature",
    name: { fr: "Mi Amor", de: "Mi Amor", en: "Mi Amor" },
    notes: {
      fr: "Banane • Ananas • Menthe",
      de: "Banane • Ananas • Minze",
      en: "Banana • Pineapple • Mint"
    },
    position: 2,
    available: true
  },
  {
    id: "watermelon",
    type: "signature",
    name: { fr: "Watermelon", de: "Watermelon", en: "Watermelon" },
    notes: {
      fr: "Menthe • Pastèque",
      de: "Minze • Wassermelone",
      en: "Mint • Watermelon"
    },
    position: 3,
    available: true
  },
  {
    id: "love-66",
    type: "signature",
    name: { fr: "Love 66", de: "Love 66", en: "Love 66" },
    notes: {
      fr: "Melon • Pastèque • Fruit de la passion",
      de: "Melone • Wassermelone • Passionsfrucht",
      en: "Melon • Watermelon • Passion fruit"
    },
    badge: "best-seller",
    position: 4,
    available: true
  },
  {
    id: "hawai",
    type: "signature",
    name: { fr: "Hawaï", de: "Hawaï", en: "Hawaï" },
    notes: {
      fr: "Mangue • Ananas • Menthe",
      de: "Mango • Ananas • Minze",
      en: "Mango • Pineapple • Mint"
    },
    position: 5,
    available: true
  },
  {
    id: "fraise-banane",
    type: "signature",
    name: { fr: "Fraise Banane", de: "Fraise Banane", en: "Fraise Banane" },
    notes: {
      fr: "Fraise • Banane",
      de: "Erdbeere • Banane",
      en: "Strawberry • Banana"
    },
    position: 6,
    available: true
  },
  {
    id: "lady-killer",
    type: "signature",
    name: { fr: "Lady Killer", de: "Lady Killer", en: "Lady Killer" },
    notes: {
      fr: "Mangue • Melon • Fraise",
      de: "Mango • Melone • Erdbeere",
      en: "Mango • Melon • Strawberry"
    },
    badge: "best-seller",
    position: 7,
    available: true
  },
  {
    id: "menthe-mangue",
    type: "signature",
    name: { fr: "Menthe Mangue", de: "Menthe Mangue", en: "Menthe Mangue" },
    notes: {
      fr: "Mangue • Ananas",
      de: "Mango • Ananas",
      en: "Mango • Pineapple"
    },
    position: 8,
    available: true
  },
  {
    id: "african-queen",
    type: "signature",
    name: { fr: "African Queen", de: "African Queen", en: "African Queen" },
    notes: {
      fr: "Cocktail de fruits frais sucrés",
      de: "Süßer Cocktail aus frischen Früchten",
      en: "Sweet cocktail of fresh fruits"
    },
    badge: "signature",
    position: 9,
    available: true
  },
  {
    id: "ice-kaktus",
    type: "signature",
    name: { fr: "Ice Kaktus", de: "Ice Kaktus", en: "Ice Kaktus" },
    notes: {
      fr: "Kaktus glacé",
      de: "Eisgekühlter Kaktus",
      en: "Iced cactus"
    },
    position: 10,
    available: true
  },
  {
    id: "blue-mistery",
    type: "signature",
    name: { fr: "Blue Mistery", de: "Blue Mistery", en: "Blue Mistery" },
    notes: {
      fr: "Myrtilles • Menthe légère",
      de: "Blaubeeren • Leichte Minze",
      en: "Blueberries • Light mint"
    },
    position: 11,
    available: true
  },
  ...[
    ["menthe", "Menthe", "Minze", "Mint"],
    ["menthe-sucree", "Menthe Sucrée", "Süße Minze", "Sweet Mint"],
    ["double-pomme", "Double Pomme", "Doppelapfel", "Double Apple"],
    ["framboise", "Framboise", "Himbeere", "Raspberry"],
    ["kiwi", "Kiwi", "Kiwi", "Kiwi"],
    ["citron", "Citron", "Zitrone", "Lemon"],
    ["arlequin", "Arlequin", "Harlekin", "Harlequin"],
    ["ananas", "Ananas", "Ananas", "Pineapple"],
    ["pomme-sucree", "Pomme Sucrée", "Süßer Apfel", "Sweet Apple"],
    ["peche", "Pêche", "Pfirsich", "Peach"]
  ].map(([id, fr, de, en], index) => ({
    id,
    type: "classique" as const,
    name: { fr, de, en },
    notes: { ...emptyLocaleRecord },
    position: 100 + index,
    available: true
  }))
];

export function normalizeChichaFlavor(flavor: ChichaFlavor): ChichaFlavor {
  return {
    ...flavor,
    type: flavor.type === "classique" ? "classique" : "signature",
    name: { ...emptyLocaleRecord, ...flavor.name },
    notes: { ...emptyLocaleRecord, ...flavor.notes },
    badge:
      flavor.badge === "best-seller" || flavor.badge === "signature"
        ? flavor.badge
        : "",
    available: flavor.available ?? true,
    position: Number.isFinite(Number(flavor.position)) ? Number(flavor.position) : 0
  };
}
