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
  chichas: { en: "Chichas", fr: "Chichas", de: "Shishas" },
  cocktails: { en: "Cocktails", fr: "Cocktails", de: "Cocktails" },
  mocktails: { en: "Mocktails", fr: "Mocktails", de: "Mocktails" },
  milkshakes: { en: "Milkshakes", fr: "Milkshakes", de: "Milkshakes" },
  smoothies: { en: "Smoothies", fr: "Smoothies", de: "Smoothies" },
  spiritueux: { en: "Spiritueux", fr: "Spiritueux", de: "Spirituosen" },
  boissons: { en: "Boissons", fr: "Boissons", de: "Getranke" },
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
    enter: "Enter the Lounge",
    search: "Search the menu",
    favorites: "Favorites",
    all: "All",
    admin: "Admin",
    lounge: "Lounge",
    menu: "Menu",
    review: "Google Reviews",
    instagram: "Instagram",
    editMenu: "Edit menu",
    product: "Product",
    price: "Price",
    save: "Save",
    configured: "Supabase ready",
    localMode: "Local preview mode",
    empty: "No products yet"
  },
  fr: {
    welcome: "Bienvenue chez GOIA",
    enter: "Entrer dans le lounge",
    search: "Rechercher dans le menu",
    favorites: "Favoris",
    all: "Tout",
    admin: "Admin",
    lounge: "Lounge",
    menu: "Menu",
    review: "Avis Google",
    instagram: "Instagram",
    editMenu: "Modifier le menu",
    product: "Produit",
    price: "Prix",
    save: "Enregistrer",
    configured: "Supabase pret",
    localMode: "Mode local",
    empty: "Aucun produit pour le moment"
  },
  de: {
    welcome: "Willkommen bei GOIA",
    enter: "Die Lounge betreten",
    search: "Menu durchsuchen",
    favorites: "Favoriten",
    all: "Alle",
    admin: "Admin",
    lounge: "Lounge",
    menu: "Menu",
    review: "Google Bewertungen",
    instagram: "Instagram",
    editMenu: "Menu bearbeiten",
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
      de: "Traditionelle Shisha mit allen verfugbaren Sorten."
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
      fr: "Systeme de chauffe premium Quasar avec tous les parfums disponibles.",
      de: "Premium Quasar Heizsystem mit allen verfugbaren Sorten."
    }
  }
];
