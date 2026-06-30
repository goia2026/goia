export type Locale = "en" | "fr" | "de";

export type Category =
  | "hookah"
  | "cocktails"
  | "mocktails"
  | "soft-drinks"
  | "hot-drinks"
  | "spirits"
  | "milkshakes"
  | "smoothies"
  | "desserts"
  | "crepes"
  | "ice-cream";

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

export const categoryLabels: Record<Category, Record<Locale, string>> = {
  hookah: { en: "Hookah", fr: "Chicha", de: "Shisha" },
  cocktails: { en: "Cocktails", fr: "Cocktails", de: "Cocktails" },
  mocktails: { en: "Mocktails", fr: "Mocktails", de: "Mocktails" },
  "soft-drinks": { en: "Soft Drinks", fr: "Boissons Fraiches", de: "Softdrinks" },
  "hot-drinks": { en: "Hot Drinks", fr: "Boissons Chaudes", de: "Heisse Getranke" },
  spirits: { en: "Spirits", fr: "Spiritueux", de: "Spirituosen" },
  milkshakes: { en: "Milkshakes", fr: "Milkshakes", de: "Milchshakes" },
  smoothies: { en: "Smoothies", fr: "Smoothies", de: "Smoothies" },
  desserts: { en: "Desserts", fr: "Desserts", de: "Desserts" },
  crepes: { en: "Crepes", fr: "Crepes", de: "Crepes" },
  "ice-cream": { en: "Ice Cream", fr: "Glaces", de: "Eiscreme" }
};

export const categoryOrder = Object.keys(categoryLabels) as Category[];

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
    empty: "No products found"
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
    empty: "Aucun produit trouve"
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
    empty: "Keine Produkte gefunden"
  }
} satisfies Record<Locale, Record<string, string>>;

const images = {
  hookah: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=85",
  cocktail: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=1200&q=85",
  mocktail: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=85",
  soft: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1200&q=85",
  coffee: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85",
  spirits: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1200&q=85",
  milkshake: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1200&q=85",
  smoothie: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=1200&q=85",
  dessert: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=85",
  crepe: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1200&q=85",
  iceCream: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=85"
};

export const initialProducts: Product[] = [
  {
    id: "royal-mint",
    category: "hookah",
    price: 32,
    image: images.hookah,
    signature: true,
    name: { en: "Royal Mint", fr: "Menthe Royale", de: "Royal Mint" },
    description: {
      en: "Fresh mint, cool smoke, polished GOIA finish.",
      fr: "Menthe fraiche, fumee douce, finition GOIA.",
      de: "Frische Minze, kuhler Rauch, edles GOIA Finish."
    }
  },
  {
    id: "goia-love",
    category: "hookah",
    price: 36,
    image: images.hookah,
    name: { en: "GOIA Love", fr: "GOIA Love", de: "GOIA Love" },
    description: {
      en: "Red berries, vanilla and a delicate floral note.",
      fr: "Fruits rouges, vanille et note florale delicate.",
      de: "Rote Beeren, Vanille und eine feine Blumennote."
    }
  },
  {
    id: "taupe-negroni",
    category: "cocktails",
    price: 16,
    image: images.cocktail,
    signature: true,
    name: { en: "Taupe Negroni", fr: "Negroni Taupe", de: "Taupe Negroni" },
    description: {
      en: "Bitter orange, vermouth and a satin gin profile.",
      fr: "Orange amere, vermouth et gin satine.",
      de: "Bitterorange, Wermut und ein seidiges Gin-Profil."
    }
  },
  {
    id: "golden-mule",
    category: "cocktails",
    price: 15,
    image: images.cocktail,
    name: { en: "Golden Mule", fr: "Golden Mule", de: "Golden Mule" },
    description: {
      en: "Vodka, ginger beer, lime and pressed mint.",
      fr: "Vodka, ginger beer, citron vert et menthe pressee.",
      de: "Vodka, Ginger Beer, Limette und gepresste Minze."
    }
  },
  {
    id: "noir-bloom",
    category: "mocktails",
    price: 12,
    image: images.mocktail,
    name: { en: "Noir Bloom", fr: "Noir Bloom", de: "Noir Bloom" },
    description: {
      en: "Blackberry, elderflower, lemon and sparkling water.",
      fr: "Mure, fleur de sureau, citron et eau petillante.",
      de: "Brombeere, Holunderblute, Zitrone und Sprudelwasser."
    }
  },
  {
    id: "virgin-paloma",
    category: "mocktails",
    price: 11,
    image: images.mocktail,
    name: { en: "Virgin Paloma", fr: "Paloma Sans Alcool", de: "Virgin Paloma" },
    description: {
      en: "Pink grapefruit, agave, lime and soda.",
      fr: "Pamplemousse rose, agave, citron vert et soda.",
      de: "Rosa Grapefruit, Agave, Limette und Soda."
    }
  },
  {
    id: "evian",
    category: "soft-drinks",
    price: 5,
    image: images.soft,
    name: { en: "Evian", fr: "Evian", de: "Evian" },
    description: {
      en: "Still mineral water.",
      fr: "Eau minerale plate.",
      de: "Stilles Mineralwasser."
    }
  },
  {
    id: "artisan-cola",
    category: "soft-drinks",
    price: 6,
    image: images.soft,
    name: { en: "Artisan Cola", fr: "Cola Artisanal", de: "Artisan Cola" },
    description: {
      en: "Botanical cola served ice cold.",
      fr: "Cola botanique servi tres frais.",
      de: "Botanische Cola, eiskalt serviert."
    }
  },
  {
    id: "moroccan-tea",
    category: "hot-drinks",
    price: 8,
    image: images.coffee,
    name: { en: "Moroccan Tea", fr: "The Marocain", de: "Marokkanischer Tee" },
    description: {
      en: "Gunpowder green tea, mint and amber sugar.",
      fr: "The vert gunpowder, menthe et sucre ambre.",
      de: "Gunpowder-Gruntee, Minze und bernsteinfarbener Zucker."
    }
  },
  {
    id: "espresso",
    category: "hot-drinks",
    price: 4,
    image: images.coffee,
    name: { en: "Espresso", fr: "Espresso", de: "Espresso" },
    description: {
      en: "Short, intense and beautifully balanced.",
      fr: "Court, intense et parfaitement equilibre.",
      de: "Kurz, intensiv und fein ausbalanciert."
    }
  },
  {
    id: "cognac-vsop",
    category: "spirits",
    price: 18,
    image: images.spirits,
    name: { en: "Cognac VSOP", fr: "Cognac VSOP", de: "Cognac VSOP" },
    description: {
      en: "Velvet oak, dried fruit and a long finish.",
      fr: "Chene veloute, fruits secs et finale longue.",
      de: "Samtige Eiche, Trockenfruchte und langer Abgang."
    }
  },
  {
    id: "single-malt",
    category: "spirits",
    price: 20,
    image: images.spirits,
    name: { en: "Single Malt", fr: "Single Malt", de: "Single Malt" },
    description: {
      en: "Honeyed malt, smoke and polished spice.",
      fr: "Malt mielle, fumee et epices fines.",
      de: "Honigmalz, Rauch und elegante Gewurze."
    }
  },
  {
    id: "pistachio-shake",
    category: "milkshakes",
    price: 12,
    image: images.milkshake,
    signature: true,
    name: { en: "Pistachio Velvet", fr: "Velours Pistache", de: "Pistazien Velvet" },
    description: {
      en: "Pistachio cream, vanilla gelato and roasted crumble.",
      fr: "Creme de pistache, gelato vanille et crumble torrefie.",
      de: "Pistaziencreme, Vanille-Gelato und gerosteter Crumble."
    }
  },
  {
    id: "strawberry-shake",
    category: "milkshakes",
    price: 11,
    image: images.milkshake,
    name: { en: "Strawberry Silk", fr: "Soie Fraise", de: "Erdbeer Silk" },
    description: {
      en: "Strawberry, cream and a soft vanilla lift.",
      fr: "Fraise, creme et vanille delicate.",
      de: "Erdbeere, Sahne und sanfte Vanille."
    }
  },
  {
    id: "mango-smoothie",
    category: "smoothies",
    price: 10,
    image: images.smoothie,
    name: { en: "Mango Aura", fr: "Aura Mangue", de: "Mango Aura" },
    description: {
      en: "Mango, passion fruit and chilled coconut water.",
      fr: "Mangue, fruit de la passion et eau de coco fraiche.",
      de: "Mango, Passionsfrucht und gekuhltes Kokoswasser."
    }
  },
  {
    id: "green-smoothie",
    category: "smoothies",
    price: 10,
    image: images.smoothie,
    name: { en: "Green Pearl", fr: "Perle Verte", de: "Grune Perle" },
    description: {
      en: "Apple, kiwi, spinach and lime.",
      fr: "Pomme, kiwi, epinard et citron vert.",
      de: "Apfel, Kiwi, Spinat und Limette."
    }
  },
  {
    id: "fondant",
    category: "desserts",
    price: 12,
    image: images.dessert,
    name: { en: "Chocolate Fondant", fr: "Fondant Chocolat", de: "Schoko Fondant" },
    description: {
      en: "Warm chocolate heart, vanilla cream.",
      fr: "Coeur chocolat chaud, creme vanille.",
      de: "Warmer Schokoladenkern, Vanillecreme."
    }
  },
  {
    id: "tiramisu",
    category: "desserts",
    price: 11,
    image: images.dessert,
    name: { en: "Tiramisu", fr: "Tiramisu", de: "Tiramisu" },
    description: {
      en: "Mascarpone, espresso and cacao dust.",
      fr: "Mascarpone, espresso et poudre de cacao.",
      de: "Mascarpone, Espresso und Kakao."
    }
  },
  {
    id: "nutella-crepe",
    category: "crepes",
    price: 10,
    image: images.crepe,
    name: { en: "Nutella Crepe", fr: "Crepe Nutella", de: "Nutella Crepe" },
    description: {
      en: "Fine French crepe with hazelnut chocolate.",
      fr: "Crepe fine au chocolat noisette.",
      de: "Feine Crepe mit Haselnussschokolade."
    }
  },
  {
    id: "lotus-crepe",
    category: "crepes",
    price: 11,
    image: images.crepe,
    name: { en: "Lotus Crepe", fr: "Crepe Lotus", de: "Lotus Crepe" },
    description: {
      en: "Biscoff cream, biscuit crumble and vanilla.",
      fr: "Creme Biscoff, crumble biscuit et vanille.",
      de: "Biscoff-Creme, Kekscrumble und Vanille."
    }
  },
  {
    id: "gelato-trio",
    category: "ice-cream",
    price: 9,
    image: images.iceCream,
    name: { en: "Gelato Trio", fr: "Trio Gelato", de: "Gelato Trio" },
    description: {
      en: "Three scoops from the GOIA selection.",
      fr: "Trois boules de la selection GOIA.",
      de: "Drei Kugeln aus der GOIA Auswahl."
    }
  },
  {
    id: "vanilla-noir",
    category: "ice-cream",
    price: 8,
    image: images.iceCream,
    name: { en: "Vanilla Noir", fr: "Vanille Noir", de: "Vanilla Noir" },
    description: {
      en: "Madagascar vanilla with dark chocolate lace.",
      fr: "Vanille Madagascar et dentelle chocolat noir.",
      de: "Madagaskar-Vanille mit dunkler Schokolade."
    }
  }
];
