export type Locale = "en" | "fr" | "de";

export type Category =
  | "chichas"
  | "cocktails"
  | "mocktails"
  | "milkshakes"
  | "smoothies"
  | "spiritueux"
  | "boissons"
  | "desserts"
  | "goia-signatures";

export type Product = {
  id: string;
  category: Category;
  price: number;
  image: string;
  signature?: boolean;
  featured?: boolean;
  badge?: string;
  available?: boolean;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const categoryOrder: Category[] = [
  "chichas",
  "cocktails",
  "mocktails",
  "milkshakes",
  "smoothies",
  "spiritueux",
  "boissons",
  "desserts",
  "goia-signatures"
];

export const categoryLabels: Record<Category, Record<Locale, string>> = {
  chichas: { en: "Hookahs", fr: "Chichas", de: "Shishas" },
  cocktails: { en: "Cocktails", fr: "Cocktails", de: "Cocktails" },
  mocktails: { en: "Mocktails", fr: "Mocktails", de: "Mocktails" },
  milkshakes: { en: "Milkshakes", fr: "Milkshakes", de: "Milkshakes" },
  smoothies: { en: "Smoothies", fr: "Smoothies", de: "Smoothies" },
  spiritueux: { en: "Spirits", fr: "Spiritueux", de: "Spirituosen" },
  boissons: { en: "Drinks", fr: "Boissons", de: "Getränke" },
  desserts: { en: "Desserts", fr: "Desserts", de: "Desserts" },
  "goia-signatures": {
    en: "GOIA Signatures",
    fr: "GOIA Signatures",
    de: "GOIA Signatures"
  }
};

export const uiCopy = {
  en: {
    welcome: "Welcome to GOIA",
    enter: "Explore the Menu",
    search: "Search the menu",
    favorites: "Favorites",
    all: "All",
    admin: "Administration",
    lounge: "Lounge",
    menu: "Menu",
    review: "Google Reviews",
    instagram: "Instagram",
    editMenu: "Edit menu",
    product: "Product",
    price: "Price",
    save: "Save",
    configured: "Supabase ready",
    localMode: "Local mode",
    empty: "No products yet"
  },
  fr: {
    welcome: "Bienvenue chez GOIA",
    enter: "Découvrir la carte",
    search: "Rechercher dans la carte",
    favorites: "Favoris",
    all: "Tout",
    admin: "Administration",
    lounge: "Lounge",
    menu: "Carte",
    review: "Avis Google",
    instagram: "Instagram",
    editMenu: "Modifier la carte",
    product: "Produit",
    price: "Prix",
    save: "Enregistrer",
    configured: "Supabase prêt",
    localMode: "Mode local",
    empty: "Aucun produit pour le moment"
  },
  de: {
    welcome: "Willkommen bei GOIA",
    enter: "Karte entdecken",
    search: "Karte durchsuchen",
    favorites: "Favoriten",
    all: "Alle",
    admin: "Administration",
    lounge: "Lounge",
    menu: "Karte",
    review: "Google Bewertungen",
    instagram: "Instagram",
    editMenu: "Karte bearbeiten",
    product: "Produkt",
    price: "Preis",
    save: "Speichern",
    configured: "Supabase bereit",
    localMode: "Lokaler Modus",
    empty: "Noch keine Produkte"
  }
} satisfies Record<Locale, Record<string, string>>;

export const initialProducts: Product[] = [
  {
    id: "chicha-classique",
    category: "chichas",
    price: 15,
    image: "",
    available: true,
    name: {
      en: "Chicha Classique",
      fr: "Chicha Classique",
      de: "Chicha Classique"
    },
    description: {
      en: "Traditional hookah with all available flavors.",
      fr: "Chicha traditionnelle avec tous les parfums disponibles.",
      de: "Traditionelle Shisha mit allen verfügbaren Sorten."
    }
  },
  {
    id: "quasar-premium",
    category: "chichas",
    price: 20,
    image: "",
    available: true,
    name: {
      en: "Quasar Premium",
      fr: "Quasar Premium",
      de: "Quasar Premium"
    },
    description: {
      en: "Premium Quasar heating system with all available flavors.",
      fr: "Système de chauffe premium Quasar avec tous les parfums disponibles.",
      de: "Premium Quasar Heizsystem mit allen verfügbaren Sorten."
    }
  },
  {
    id: "quasar-tete-quasar",
    category: "chichas",
    price: 25,
    image: "",
    available: true,
    badge: "⭐ Premium+",
    name: {
      en: "Quasar + Tête Quasar",
      fr: "Quasar + Tête Quasar",
      de: "Quasar + Tête Quasar"
    },
    description: {
      en: "Official Quasar head with Quasar heating system. Premium experience, dense smoke and long-lasting session.",
      fr: "Tête Quasar officielle avec système de chauffe Quasar. Expérience premium, fumée dense et longue durée.",
      de: "Offizieller Quasar Kopf mit Quasar Heizsystem. Premium-Erlebnis, dichter Rauch und lange Dauer."
    }
  }
];
