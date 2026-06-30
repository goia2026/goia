export type Locale = "en" | "fr" | "de";

export type Category =
  | "chichas"
  | "softs-juices"
  | "hot-drinks"
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
  ingredients?: Record<Locale, string>;
};

export const categoryOrder: Category[] = [
  "chichas",
  "softs-juices",
  "hot-drinks",
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
  "softs-juices": {
    en: "Softs & Juices",
    fr: "Softs & Jus",
    de: "Softdrinks & Säfte"
  },
  "hot-drinks": {
    en: "Hot Drinks",
    fr: "Boissons Chaudes",
    de: "Heißgetränke"
  },
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

function product(input: {
  id: string;
  category: Category;
  name: string | Record<Locale, string>;
  description: Record<Locale, string>;
  ingredients?: Record<Locale, string>;
  image?: string;
  price?: number;
  badge?: string;
  featured?: boolean;
  signature?: boolean;
}): Product {
  return {
    id: input.id,
    category: input.category,
    price: input.price ?? 0,
    image: input.image ?? "",
    available: true,
    badge: input.badge,
    featured: input.featured,
    signature: input.signature,
    name:
      typeof input.name === "string"
        ? {
            en: input.name,
            fr: input.name,
            de: input.name
          }
        : input.name,
    description: input.description,
    ingredients: input.ingredients
  };
}

export const initialProducts: Product[] = [
  product({
    id: "chicha-classique",
    category: "chichas",
    price: 15,
    badge: "classic",
    image: "/goia-classic-hookah.jpg",
    name: "Chicha Classique",
    description: {
      en: "Traditional hookah with all available flavors.",
      fr: "Chicha traditionnelle avec tous les parfums disponibles.",
      de: "Traditionelle Shisha mit allen verfügbaren Sorten."
    }
  }),
  product({
    id: "quasar-premium",
    category: "chichas",
    price: 20,
    badge: "premium",
    image: "/goia-quasar.png",
    name: "Quasar",
    description: {
      en: "Premium Quasar heating system with all available flavors.",
      fr: "Système de chauffe premium Quasar avec tous les parfums disponibles.",
      de: "Premium Quasar Heizsystem mit allen verfügbaren Sorten."
    }
  }),
  product({
    id: "quasar-tete-quasar",
    category: "chichas",
    price: 25,
    badge: "premium",
    image: "/goia-quasar-tete.png",
    name: "Quasar + Tête Quasar",
    description: {
      en: "Official Quasar head with Quasar heating system. Premium experience, dense smoke and long-lasting session.",
      fr: "Tête Quasar officielle avec système de chauffe Quasar. Expérience premium, fumée dense et longue durée.",
      de: "Offizieller Quasar Kopf mit Quasar Heizsystem. Premium-Erlebnis, dichter Rauch und lange Dauer."
    }
  }),
  product({
    id: "coca-cola",
    category: "softs-juices",
    price: 4,
    name: "Coca-Cola",
    description: {
      en: "Iconic Coca-Cola served chilled.",
      fr: "Coca-Cola iconique servi frais.",
      de: "Ikonische Coca-Cola, gekühlt serviert."
    }
  }),
  product({
    id: "coca-cola-zero",
    category: "softs-juices",
    price: 4,
    name: "Coca-Cola Zero",
    description: {
      en: "Zero sugar Coca-Cola served chilled.",
      fr: "Coca-Cola sans sucres servi frais.",
      de: "Zuckerfreie Coca-Cola, gekühlt serviert."
    }
  }),
  product({
    id: "sprite",
    category: "softs-juices",
    price: 4,
    name: "Sprite",
    description: {
      en: "Crisp lemon-lime soda served chilled.",
      fr: "Soda citron-lime frais et pétillant.",
      de: "Frischer Zitronen-Limetten-Soda, gekühlt serviert."
    }
  }),
  product({
    id: "fanta",
    category: "softs-juices",
    price: 4,
    name: "Fanta",
    description: {
      en: "Sparkling orange soda served chilled.",
      fr: "Soda orange pétillant servi frais.",
      de: "Prickelnder Orangensoda, gekühlt serviert."
    }
  }),
  product({
    id: "red-bull",
    category: "softs-juices",
    price: 4,
    name: "Red Bull",
    description: {
      en: "Classic, Watermelon or Coconut energy drink.",
      fr: "Boisson énergisante Classic, Watermelon ou Coconut.",
      de: "Energy Drink in Classic, Watermelon oder Coconut."
    }
  }),
  product({
    id: "elephant-bay",
    category: "softs-juices",
    price: 4,
    name: "Elephant Bay",
    description: {
      en: "Premium iced tea served chilled.",
      fr: "Thé glacé premium servi frais.",
      de: "Premium Eistee, gekühlt serviert."
    }
  }),
  product({
    id: "bissap",
    category: "softs-juices",
    price: 4,
    name: "Bissap",
    description: {
      en: "Refreshing hibiscus drink with a deep ruby character.",
      fr: "Boisson rafraîchissante à l’hibiscus, intense et rubis.",
      de: "Erfrischendes Hibiskusgetränk mit tiefem Rubin-Charakter."
    }
  }),
  product({
    id: "orange-juice",
    category: "softs-juices",
    price: 3.5,
    name: {
      en: "Orange Juice",
      fr: "Jus d’Orange",
      de: "Orangensaft"
    },
    description: {
      en: "Orange juice served chilled.",
      fr: "Jus d’orange servi frais.",
      de: "Orangensaft, gekühlt serviert."
    }
  }),
  product({
    id: "apple-juice",
    category: "softs-juices",
    price: 3.5,
    name: {
      en: "Apple Juice",
      fr: "Jus de Pomme",
      de: "Apfelsaft"
    },
    description: {
      en: "Apple juice served chilled.",
      fr: "Jus de pomme servi frais.",
      de: "Apfelsaft, gekühlt serviert."
    }
  }),
  product({
    id: "pineapple-juice",
    category: "softs-juices",
    price: 3.5,
    name: {
      en: "Pineapple Juice",
      fr: "Jus d’Ananas",
      de: "Ananassaft"
    },
    description: {
      en: "Pineapple juice served chilled.",
      fr: "Jus d’ananas servi frais.",
      de: "Ananassaft, gekühlt serviert."
    }
  }),
  product({
    id: "syrups",
    category: "softs-juices",
    price: 3.5,
    name: {
      en: "Syrups",
      fr: "Sirops",
      de: "Sirup"
    },
    description: {
      en: "Strawberry, peach, violet and seasonal syrup flavors.",
      fr: "Fraise, pêche, violette et parfums de sirop selon sélection.",
      de: "Erdbeere, Pfirsich, Veilchen und weitere Sirupsorten nach Auswahl."
    }
  }),
  product({
    id: "diabolo",
    category: "softs-juices",
    price: 3.5,
    name: "Diabolo",
    description: {
      en: "Sparkling lemonade with syrup.",
      fr: "Limonade pétillante avec sirop.",
      de: "Prickelnde Limonade mit Sirup."
    }
  }),
  product({
    id: "still-water",
    category: "softs-juices",
    price: 3,
    name: {
      en: "Still Water",
      fr: "Eau Plate",
      de: "Stilles Wasser"
    },
    description: {
      en: "Fresh still table water.",
      fr: "Eau plate fraîche.",
      de: "Frisches stilles Wasser."
    }
  }),
  product({
    id: "sparkling-water",
    category: "softs-juices",
    price: 3,
    name: {
      en: "Sparkling Water",
      fr: "Eau Pétillante",
      de: "Sprudelwasser"
    },
    description: {
      en: "Fresh sparkling table water.",
      fr: "Eau pétillante fraîche.",
      de: "Frisches Sprudelwasser."
    }
  }),
  product({
    id: "moroccan-tea-small",
    category: "hot-drinks",
    price: 4,
    name: {
      en: "Moroccan Tea (Small)",
      fr: "Thé Marocain (Petit)",
      de: "Marokkanischer Tee (Klein)"
    },
    description: {
      en: "Traditional Moroccan mint tea, served in a small format.",
      fr: "Thé marocain traditionnel à la menthe, servi en petit format.",
      de: "Traditioneller marokkanischer Minztee, klein serviert."
    }
  }),
  product({
    id: "moroccan-tea-large",
    category: "hot-drinks",
    price: 8,
    name: {
      en: "Moroccan Tea (Large)",
      fr: "Thé Marocain (Grand)",
      de: "Marokkanischer Tee (Groß)"
    },
    description: {
      en: "Traditional Moroccan mint tea, served in a generous format.",
      fr: "Thé marocain traditionnel à la menthe, servi en grand format.",
      de: "Traditioneller marokkanischer Minztee, großzügig serviert."
    }
  }),
  product({
    id: "espresso",
    category: "hot-drinks",
    price: 2.5,
    name: "Espresso",
    description: {
      en: "Short, intense espresso with a clean aromatic finish.",
      fr: "Espresso court et intense, à la finale aromatique.",
      de: "Kurzer, intensiver Espresso mit aromatischem Finish."
    }
  }),
  product({
    id: "double-espresso",
    category: "hot-drinks",
    price: 3.5,
    name: {
      en: "Double Espresso",
      fr: "Double Espresso",
      de: "Doppelter Espresso"
    },
    description: {
      en: "A stronger double espresso for a deeper coffee moment.",
      fr: "Double espresso plus intense pour un moment café profond.",
      de: "Ein kräftiger doppelter Espresso für einen intensiveren Kaffeemoment."
    }
  }),
  product({
    id: "americano",
    category: "hot-drinks",
    price: 3.5,
    name: "Americano",
    description: {
      en: "Smooth black coffee with elegant espresso depth.",
      fr: "Café allongé, doux, avec la profondeur de l’espresso.",
      de: "Sanfter schwarzer Kaffee mit eleganter Espressotiefe."
    }
  }),
  product({
    id: "cappuccino",
    category: "hot-drinks",
    price: 4,
    name: "Cappuccino",
    description: {
      en: "Espresso, steamed milk and a soft milk foam crown.",
      fr: "Espresso, lait chaud et mousse de lait délicate.",
      de: "Espresso, warme Milch und feiner Milchschaum."
    }
  }),
  product({
    id: "latte-macchiato",
    category: "hot-drinks",
    price: 4.5,
    name: "Latte Macchiato",
    description: {
      en: "Layered milk coffee with a soft, creamy texture.",
      fr: "Café au lait en couches, doux et crémeux.",
      de: "Geschichteter Milchkaffee mit weicher, cremiger Textur."
    }
  }),
  product({
    id: "iced-latte-macchiato-vanilla",
    category: "hot-drinks",
    price: 5,
    name: {
      en: "Iced Latte Macchiato Vanilla",
      fr: "Latte Macchiato Glacé Vanille",
      de: "Iced Latte Macchiato Vanille"
    },
    description: {
      en: "Iced latte macchiato with a smooth vanilla finish.",
      fr: "Latte macchiato glacé à la vanille, doux et élégant.",
      de: "Iced Latte Macchiato mit sanftem Vanille-Finish."
    }
  }),
  product({
    id: "iced-latte-macchiato-caramel",
    category: "hot-drinks",
    price: 5,
    name: {
      en: "Iced Latte Macchiato Caramel",
      fr: "Latte Macchiato Glacé Caramel",
      de: "Iced Latte Macchiato Karamell"
    },
    description: {
      en: "Iced latte macchiato with a rounded caramel finish.",
      fr: "Latte macchiato glacé au caramel, rond et gourmand.",
      de: "Iced Latte Macchiato mit rundem Karamell-Finish."
    }
  }),
  product({
    id: "mojito-classic",
    category: "cocktails",
    price: 10,
    name: "Mojito Classic",
    description: {
      en: "A timeless fresh classic with bright mint, lime and Havana rum.",
      fr: "Un grand classique frais aux notes de menthe, citron vert et rhum Havana.",
      de: "Ein zeitlos frischer Klassiker mit Minze, Limette und Havana Rum."
    },
    ingredients: {
      en: "Fresh mint, lime, cane sugar, Havana rum and sparkling water.",
      fr: "Menthe fraîche, citron vert, sucre de canne, rhum Havana et eau pétillante.",
      de: "Frische Minze, Limette, Rohrzucker, Havana Rum und Sprudelwasser."
    }
  }),
  product({
    id: "mojito-fraise",
    category: "cocktails",
    price: 10,
    name: "Mojito Fraise",
    description: {
      en: "A fruity mojito with fresh strawberry depth and crisp mint.",
      fr: "Un mojito fruité à la fraise, frais et délicatement mentholé.",
      de: "Ein fruchtiger Mojito mit Erdbeernote und frischer Minze."
    },
    ingredients: {
      en: "Fresh mint, lime, cane sugar, Havana rum, sparkling water and strawberry purée.",
      fr: "Menthe fraîche, citron vert, sucre de canne, rhum Havana, eau pétillante et purée de fraise.",
      de: "Frische Minze, Limette, Rohrzucker, Havana Rum, Sprudelwasser und Erdbeerpüree."
    }
  }),
  product({
    id: "mojito-framboise",
    category: "cocktails",
    price: 10,
    name: "Mojito Framboise",
    description: {
      en: "Fresh mint and lime lifted by a refined raspberry finish.",
      fr: "Menthe fraîche et citron vert relevés par une touche raffinée de framboise.",
      de: "Frische Minze und Limette mit einem feinen Himbeer-Finish."
    },
    ingredients: {
      en: "Fresh mint, lime, cane sugar, Havana rum, sparkling water and raspberry purée.",
      fr: "Menthe fraîche, citron vert, sucre de canne, rhum Havana, eau pétillante et purée de framboise.",
      de: "Frische Minze, Limette, Rohrzucker, Havana Rum, Sprudelwasser und Himbeerpüree."
    }
  }),
  product({
    id: "mojito-mangue",
    category: "cocktails",
    price: 10,
    name: "Mojito Mangue",
    description: {
      en: "A tropical mojito with smooth mango and a fresh sparkling finish.",
      fr: "Un mojito tropical à la mangue, frais et pétillant.",
      de: "Ein tropischer Mojito mit Mango und frischem Prickeln."
    },
    ingredients: {
      en: "Fresh mint, lime, cane sugar, Havana rum, sparkling water and mango purée.",
      fr: "Menthe fraîche, citron vert, sucre de canne, rhum Havana, eau pétillante et purée de mangue.",
      de: "Frische Minze, Limette, Rohrzucker, Havana Rum, Sprudelwasser und Mangopüree."
    }
  }),
  product({
    id: "mojito-passion",
    category: "cocktails",
    price: 10,
    name: "Mojito Passion",
    description: {
      en: "A vibrant passion fruit mojito with crisp mint and lime.",
      fr: "Un mojito passion vibrant, frais et acidulé.",
      de: "Ein lebendiger Maracuja-Mojito mit Minze und Limette."
    },
    ingredients: {
      en: "Fresh mint, lime, cane sugar, Havana rum, sparkling water and passion fruit purée.",
      fr: "Menthe fraîche, citron vert, sucre de canne, rhum Havana, eau pétillante et purée de fruit de la passion.",
      de: "Frische Minze, Limette, Rohrzucker, Havana Rum, Sprudelwasser und Passionsfruchtpüree."
    }
  }),
  product({
    id: "gin-berry",
    category: "cocktails",
    price: 10,
    name: "Gin Berry",
    description: {
      en: "A fresh berry gin serve with mint, citrus and a sparkling finish.",
      fr: "Un gin fruité aux fraises fraîches, menthe, citron et finale pétillante.",
      de: "Ein frischer Berry-Gin mit Minze, Zitrus und prickelndem Finish."
    },
    ingredients: {
      en: "Gin, fresh strawberries, mint, lemon and Sprite/Schweppes.",
      fr: "Gin, fraises fraîches, menthe, citron et Sprite/Schweppes.",
      de: "Gin, frische Erdbeeren, Minze, Zitrone und Sprite/Schweppes."
    }
  }),
  product({
    id: "fresh-pasteque",
    category: "cocktails",
    price: 10,
    name: "Fresh Pastèque",
    description: {
      en: "A chilled watermelon vodka cocktail with red berries and fresh mint.",
      fr: "Un cocktail vodka pastèque rafraîchissant aux fruits rouges et menthe fraîche.",
      de: "Ein gekühlter Wassermelonen-Vodka-Cocktail mit roten Beeren und Minze."
    },
    ingredients: {
      en: "Vodka, watermelon juice, red berry purée, fresh mint and grapefruit garnish.",
      fr: "Vodka, jus de pastèque, purée de fruits rouges, menthe fraîche et garniture pamplemousse.",
      de: "Vodka, Wassermelonensaft, rotes Beerenpüree, frische Minze und Grapefruit-Garnitur."
    }
  }),
  product({
    id: "tiki-mangue",
    category: "cocktails",
    price: 10,
    name: "Tiki Mangue",
    description: {
      en: "A sunny tiki cocktail with rum, mango, coconut and pineapple.",
      fr: "Un cocktail tiki solaire au rhum, mangue, coco et ananas.",
      de: "Ein sonniger Tiki-Cocktail mit Rum, Mango, Kokos und Ananas."
    },
    ingredients: {
      en: "Rum, coconut purée, mango purée, pineapple juice and lime.",
      fr: "Rhum, purée de coco, purée de mangue, jus d’ananas et citron vert.",
      de: "Rum, Kokospüree, Mangopüree, Ananassaft und Limette."
    }
  }),
  product({
    id: "pornstar-martini",
    category: "cocktails",
    price: 10,
    name: "Pornstar Martini",
    description: {
      en: "A polished passion fruit martini with pineapple and vanilla softness.",
      fr: "Un martini passion élégant, adouci par l’ananas et la vanille.",
      de: "Ein eleganter Maracuja-Martini mit Ananas und feiner Vanille."
    },
    ingredients: {
      en: "Vodka, passion fruit juice, pineapple juice and vanilla syrup.",
      fr: "Vodka, jus de fruit de la passion, jus d’ananas et sirop de vanille.",
      de: "Vodka, Passionsfruchtsaft, Ananassaft und Vanillesirup."
    }
  }),
  product({
    id: "rubis-des-iles",
    category: "cocktails",
    price: 10,
    badge: "best-seller",
    name: "Rubis des Îles",
    description: {
      en: "A ruby-toned island cocktail with bissap, white rum and lime freshness.",
      fr: "Un cocktail rubis aux accents des îles, bissap, rhum blanc et fraîcheur citronnée.",
      de: "Ein rubinroter Insel-Cocktail mit Bissap, weißem Rum und frischer Limette."
    },
    ingredients: {
      en: "White rum, bissap, lime juice, cane sugar syrup and sparkling water.",
      fr: "Rhum blanc, bissap, jus de citron vert, sirop de sucre de canne et eau pétillante.",
      de: "Weißer Rum, Bissap, Limettensaft, Rohrzuckersirup und Sprudelwasser."
    }
  }),
  product({
    id: "virgin-mojito",
    category: "mocktails",
    price: 7,
    name: "Virgin Mojito",
    description: {
      en: "A crisp alcohol-free classic with mint, lime and sparkle.",
      fr: "Un classique sans alcool, frais, mentholé et pétillant.",
      de: "Ein alkoholfreier Klassiker, frisch, minzig und prickelnd."
    },
    ingredients: {
      en: "Fresh mint, lime, cane sugar, Sprite.",
      fr: "Menthe fraîche, citron vert, sucre de canne, Sprite.",
      de: "Frische Minze, Limette, Rohrzucker, Sprite."
    }
  }),
  product({
    id: "virgin-mojito-fraise",
    category: "mocktails",
    price: 7,
    name: "Virgin Mojito Fraise",
    description: {
      en: "A strawberry virgin mojito with fresh mint and lime.",
      fr: "Un virgin mojito fraise avec menthe fraîche et citron vert.",
      de: "Ein Erdbeer Virgin Mojito mit frischer Minze und Limette."
    },
    ingredients: {
      en: "Fresh mint, lime, cane sugar, Sprite and strawberry purée.",
      fr: "Menthe fraîche, citron vert, sucre de canne, Sprite et purée de fraise.",
      de: "Frische Minze, Limette, Rohrzucker, Sprite und Erdbeerpüree."
    }
  }),
  product({
    id: "virgin-mojito-framboise",
    category: "mocktails",
    price: 7,
    name: "Virgin Mojito Framboise",
    description: {
      en: "A raspberry virgin mojito with a fresh, elegant finish.",
      fr: "Un virgin mojito framboise, frais et délicatement acidulé.",
      de: "Ein Himbeer Virgin Mojito mit frischem, elegantem Finish."
    },
    ingredients: {
      en: "Fresh mint, lime, cane sugar, Sprite and raspberry purée.",
      fr: "Menthe fraîche, citron vert, sucre de canne, Sprite et purée de framboise.",
      de: "Frische Minze, Limette, Rohrzucker, Sprite und Himbeerpüree."
    }
  }),
  product({
    id: "virgin-mojito-mangue",
    category: "mocktails",
    price: 7,
    name: "Virgin Mojito Mangue",
    description: {
      en: "A mango virgin mojito with tropical freshness and sparkle.",
      fr: "Un virgin mojito mangue aux notes tropicales et pétillantes.",
      de: "Ein Mango Virgin Mojito mit tropischer Frische und Sprudel."
    },
    ingredients: {
      en: "Fresh mint, lime, cane sugar, Sprite and mango purée.",
      fr: "Menthe fraîche, citron vert, sucre de canne, Sprite et purée de mangue.",
      de: "Frische Minze, Limette, Rohrzucker, Sprite und Mangopüree."
    }
  }),
  product({
    id: "virgin-mojito-passion",
    category: "mocktails",
    price: 7,
    name: "Virgin Mojito Passion",
    description: {
      en: "A passion fruit virgin mojito with mint, lime and a bright finish.",
      fr: "Un virgin mojito passion, mentholé, frais et lumineux.",
      de: "Ein Maracuja Virgin Mojito mit Minze, Limette und hellem Finish."
    },
    ingredients: {
      en: "Fresh mint, lime, cane sugar, Sprite and passion fruit purée.",
      fr: "Menthe fraîche, citron vert, sucre de canne, Sprite et purée de fruit de la passion.",
      de: "Frische Minze, Limette, Rohrzucker, Sprite und Passionsfruchtpüree."
    }
  }),
  product({
    id: "peach-mint",
    category: "mocktails",
    price: 7,
    name: "Peach Mint",
    description: {
      en: "A soft peach mocktail with lime, mint and sparkling freshness.",
      fr: "Un mocktail pêche doux, relevé par le citron vert, la menthe et les bulles.",
      de: "Ein sanfter Pfirsich-Mocktail mit Limette, Minze und prickelnder Frische."
    },
    ingredients: {
      en: "Peach purée, lime juice, mint and sparkling water.",
      fr: "Purée de pêche, jus de citron vert, menthe et eau pétillante.",
      de: "Pfirsichpüree, Limettensaft, Minze und Sprudelwasser."
    }
  }),
  product({
    id: "nuage-tropical",
    category: "mocktails",
    price: 7,
    name: "Nuage Tropical",
    description: {
      en: "A soft tropical cloud of coconut, passion fruit and pineapple.",
      fr: "Un nuage tropical doux à la coco, passion et ananas.",
      de: "Eine sanfte tropische Wolke aus Kokos, Passionsfrucht und Ananas."
    },
    ingredients: {
      en: "Coconut purée, passion fruit juice, pineapple juice and lime.",
      fr: "Purée de coco, jus de fruit de la passion, jus d’ananas et citron vert.",
      de: "Kokospüree, Passionsfruchtsaft, Ananassaft und Limette."
    }
  }),
  product({
    id: "rouge-frisson",
    category: "mocktails",
    price: 7,
    name: "Rouge Frisson",
    description: {
      en: "A red berry mocktail with lime, vanilla and sparkling lift.",
      fr: "Un mocktail fruits rouges, citron vert, vanille et fraîcheur pétillante.",
      de: "Ein roter Beeren-Mocktail mit Limette, Vanille und prickelnder Leichtigkeit."
    },
    ingredients: {
      en: "Red berry purée, lime juice, vanilla syrup and Sprite.",
      fr: "Purée de fruits rouges, jus de citron vert, sirop de vanille et Sprite.",
      de: "Rotes Beerenpüree, Limettensaft, Vanillesirup und Sprite."
    }
  }),
  product({
    id: "golden-fizz",
    category: "mocktails",
    price: 7,
    name: "Golden Fizz",
    description: {
      en: "A golden mango and apple mocktail with lime and bubbles.",
      fr: "Un mocktail doré mangue et pomme fraîche, citron vert et bulles fines.",
      de: "Ein goldener Mango-Apfel-Mocktail mit Limette und feiner Kohlensäure."
    },
    ingredients: {
      en: "Mango purée, fresh apple juice, lime and sparkling water.",
      fr: "Purée de mangue, jus de pomme frais, citron vert et eau pétillante.",
      de: "Mangopüree, frischer Apfelsaft, Limette und Sprudelwasser."
    }
  }),
  product({
    id: "soleil-tropical",
    category: "mocktails",
    price: 7,
    name: "Soleil Tropical",
    description: {
      en: "A sunny tropical mocktail with mango, passion fruit and lime.",
      fr: "Un mocktail tropical solaire à la mangue, passion et citron vert.",
      de: "Ein sonniger tropischer Mocktail mit Mango, Passionsfrucht und Limette."
    },
    ingredients: {
      en: "Mango purée, passion fruit purée, lime and Sprite.",
      fr: "Purée de mangue, purée de fruit de la passion, citron vert et Sprite.",
      de: "Mangopüree, Passionsfruchtpüree, Limette und Sprite."
    }
  }),
  product({
    id: "rubis-hibiscus",
    category: "mocktails",
    price: 7,
    name: "Rubis Hibiscus",
    description: {
      en: "A ruby hibiscus mocktail with pineapple, mango and sparkling freshness.",
      fr: "Un mocktail rubis à l’hibiscus, ananas, mangue et fraîcheur pétillante.",
      de: "Ein rubinroter Hibiskus-Mocktail mit Ananas, Mango und prickelnder Frische."
    },
    ingredients: {
      en: "Bissap, pineapple juice, mango purée, lime and sparkling water.",
      fr: "Bissap, jus d’ananas, purée de mangue, citron vert et eau pétillante.",
      de: "Bissap, Ananassaft, Mangopüree, Limette und Sprudelwasser."
    }
  }),
  product({
    id: "cheesecake-pistache",
    category: "desserts",
    price: 7,
    name: "Cheesecake Pistache",
    description: {
      en: "Creamy cheesecake with refined pistachio notes and a delicate dessert finish.",
      fr: "Cheesecake onctueux aux notes raffinées de pistache.",
      de: "Cremiger Cheesecake mit feinen Pistaziennoten und edlem Dessert-Finish."
    }
  }),
  product({
    id: "cheesecake-mangue-passion",
    category: "desserts",
    price: 7,
    name: "Cheesecake Mangue Passion",
    description: {
      en: "Creamy cheesecake with mango and passion fruit, fresh, bright and indulgent.",
      fr: "Cheesecake onctueux à la mangue et au fruit de la passion, frais et gourmand.",
      de: "Cremiger Cheesecake mit Mango und Passionsfrucht, frisch und genussvoll."
    }
  }),
  product({
    id: "cheesecake-fruits-rouges",
    category: "desserts",
    price: 7,
    name: "Cheesecake Fruits Rouges",
    description: {
      en: "Creamy cheesecake with red berries and a fresh, elegant finish.",
      fr: "Cheesecake onctueux aux fruits rouges, frais et élégant.",
      de: "Cremiger Cheesecake mit roten Früchten und frischem, elegantem Finish."
    }
  }),
  product({
    id: "cheesecake-speculoos",
    category: "desserts",
    price: 7,
    name: "Cheesecake Spéculoos",
    description: {
      en: "Creamy cheesecake with Spéculoos biscuit notes and a generous finish.",
      fr: "Cheesecake onctueux au Spéculoos, gourmand et généreux.",
      de: "Cremiger Cheesecake mit Spéculoos-Noten, reichhaltig und genussvoll."
    }
  }),
  product({
    id: "tarte-au-citron",
    category: "desserts",
    price: 7,
    name: "Tarte au Citron",
    description: {
      en: "Homemade lemon tart, fresh and indulgent.",
      fr: "Tarte au citron maison, fraîche et gourmande.",
      de: "Hausgemachte Zitronentarte, frisch und verführerisch."
    }
  }),
  product({
    id: "mousse-au-chocolat",
    category: "desserts",
    price: 7,
    name: "Mousse au Chocolat",
    description: {
      en: "Homemade chocolate mousse, smooth and intense.",
      fr: "Mousse au chocolat maison, onctueuse et intense.",
      de: "Hausgemachte Schokoladenmousse, cremig und intensiv."
    }
  }),
  product({
    id: "sunset-crepe",
    category: "desserts",
    price: 8,
    name: "Sunset",
    description: {
      en: "Crêpe filled with Nutella, fresh strawberries, red berry coulis and powdered sugar. Option: + scoop of ice cream (+€2).",
      fr: "Crêpe garnie de Nutella, fraises fraîches, coulis de fruits rouges et sucre glace. Option : + boule de glace (+2€).",
      de: "Crêpe mit Nutella, frischen Erdbeeren, rotem Fruchtcoulis und Puderzucker. Option: + Kugel Eis (+2€)."
    }
  }),
  product({
    id: "lotus-crepe",
    category: "desserts",
    price: 8,
    name: "Lotus",
    description: {
      en: "Crêpe with Lotus Spéculoos, biscuit pieces and warm Lotus sauce. Option: + scoop of ice cream (+€2).",
      fr: "Crêpe au Spéculoos Lotus, éclats de biscuits et sauce Lotus chaude. Option : + boule de glace (+2€).",
      de: "Crêpe mit Lotus Spéculoos, Keksstückchen und warmer Lotus-Sauce. Option: + Kugel Eis (+2€)."
    }
  }),
  product({
    id: "royal-caramel-crepe",
    category: "desserts",
    price: 8,
    name: "Royal Caramel",
    description: {
      en: "Crêpe with salted butter caramel, caramelized pecans and homemade whipped cream. Option: + scoop of ice cream (+€2).",
      fr: "Crêpe caramel beurre salé, noix de pécan caramélisées et chantilly maison. Option : + boule de glace (+2€).",
      de: "Crêpe mit Salzbutter-Karamell, karamellisierten Pekannüssen und hausgemachter Sahne. Option: + Kugel Eis (+2€)."
    }
  }),
  product({
    id: "pistachio-crepe",
    category: "desserts",
    price: 9,
    name: "Pistachio",
    description: {
      en: "Pistachio cream, pistachio pieces, whipped cream and powdered sugar. Option: + scoop of ice cream (+€2).",
      fr: "Crème de pistache, éclats de pistache, chantilly et sucre glace. Option : + boule de glace (+2€).",
      de: "Pistaziencreme, Pistazienstücke, Sahne und Puderzucker. Option: + Kugel Eis (+2€)."
    }
  }),
  product({
    id: "coupe-sunset",
    category: "desserts",
    price: 11,
    name: "Sunset",
    description: {
      en: "Madagascar vanilla ice cream, raspberry sorbet, fresh strawberries, red berries, raspberry coulis, meringue pieces, whipped cream and edible flower.",
      fr: "Glace vanille de Madagascar, sorbet framboise, fraises fraîches, fruits rouges, coulis framboise, éclats de meringue, chantilly et fleur comestible.",
      de: "Madagaskar-Vanilleeis, Himbeersorbet, frische Erdbeeren, rote Früchte, Himbeercoulis, Baiserstücke, Sahne und essbare Blüte."
    }
  }),
  product({
    id: "coupe-tropical",
    category: "desserts",
    price: 11,
    name: "Tropical",
    description: {
      en: "Mango ice cream, passion fruit sorbet, fresh mango cubes, passion fruit coulis, coconut shavings, crushed pistachios and whipped cream.",
      fr: "Glace mangue, sorbet passion, dés de mangue fraîche, coulis passion, copeaux de noix de coco, pistaches concassées et chantilly.",
      de: "Mangoeis, Passionsfruchtsorbet, frische Mangowürfel, Passionsfruchtcoulis, Kokosraspeln, gehackte Pistazien und Sahne."
    }
  }),
  product({
    id: "coupe-caramel-crown",
    category: "desserts",
    price: 11,
    name: "Caramel Crown",
    description: {
      en: "Salted butter caramel ice cream, Madagascar vanilla ice cream, blondie pieces, warm caramel sauce, caramelized Spéculoos pieces, almonds and homemade whipped cream.",
      fr: "Glace caramel beurre salé, glace vanille de Madagascar, morceaux de blondie, sauce caramel chaud, éclats de spéculoos caramélisés, amandes et chantilly maison.",
      de: "Salzbutter-Karamelleis, Madagaskar-Vanilleeis, Blondie-Stücke, warme Karamellsauce, karamellisierte Spéculoos-Stücke, Mandeln und hausgemachte Sahne."
    }
  }),
  product({
    id: "coupe-goia-signature",
    category: "desserts",
    price: 12,
    name: "Signature du G",
    signature: true,
    badge: "signature",
    description: {
      en: "Belgian chocolate ice cream, vanilla ice cream, melting brownie, warm Nutella, roasted hazelnuts, chocolate shavings and whipped cream.",
      fr: "Glace chocolat belge, glace vanille, brownie fondant, Nutella chaud, noisettes torréfiées, copeaux de chocolat et chantilly.",
      de: "Belgisches Schokoladeneis, Vanilleeis, saftiger Brownie, warmes Nutella, geröstete Haselnüsse, Schokoladenspäne und Sahne."
    }
  }),
  product({
    id: "milkshake-vanille",
    category: "milkshakes",
    price: 7,
    name: "Vanille",
    description: {
      en: "Creamy vanilla milkshake, smooth and elegant.",
      fr: "Milkshake vanille crémeux, doux et élégant.",
      de: "Cremiger Vanille-Milkshake, sanft und elegant."
    }
  }),
  product({
    id: "milkshake-oreo",
    category: "milkshakes",
    price: 8,
    name: "Oreo",
    description: {
      en: "Creamy Oreo milkshake with biscuit pieces and a generous finish.",
      fr: "Milkshake Oreo crémeux, éclats de biscuits et finition gourmande.",
      de: "Cremiger Oreo-Milkshake mit Keksstückchen und genussvollem Finish."
    }
  }),
  product({
    id: "milkshake-kinder-bueno-classic",
    category: "milkshakes",
    price: 8,
    badge: "best-seller",
    name: "Kinder Bueno Classic",
    description: {
      en: "Creamy milkshake with the signature Kinder Bueno Classic taste.",
      fr: "Milkshake crémeux au goût iconique Kinder Bueno Classic.",
      de: "Cremiger Milkshake mit dem unverwechselbaren Kinder Bueno Classic Geschmack."
    }
  }),
  product({
    id: "milkshake-kinder-bueno-white",
    category: "milkshakes",
    price: 8,
    name: "Kinder Bueno White",
    description: {
      en: "Creamy milkshake with the soft, sweet Kinder Bueno White taste.",
      fr: "Milkshake crémeux au goût doux et gourmand Kinder Bueno White.",
      de: "Cremiger Milkshake mit dem sanften, süßen Kinder Bueno White Geschmack."
    }
  }),
  product({
    id: "smoothie-funny-berry",
    category: "smoothies",
    price: 7,
    name: "Funny Berry",
    description: {
      en: "40% strawberry, 40% blackberry, 20% raspberry.",
      fr: "40% fraise, 40% mûre, 20% framboise.",
      de: "40% Erdbeere, 40% Brombeere, 20% Himbeere."
    }
  }),
  product({
    id: "smoothie-pinky-groovy",
    category: "smoothies",
    price: 7,
    name: "Pinky Groovy",
    description: {
      en: "60% strawberry, 20% banana.",
      fr: "60% fraise, 20% banane.",
      de: "60% Erdbeere, 20% Banane."
    }
  }),
  product({
    id: "smoothie-coconut-forever",
    category: "smoothies",
    price: 7,
    name: "Coconut Forever",
    description: {
      en: "45% coconut milk, 30% pineapple, 25% banana.",
      fr: "45% lait de coco, 30% ananas, 25% banane.",
      de: "45% Kokosmilch, 30% Ananas, 25% Banane."
    }
  }),
  product({
    id: "smoothie-crazy-melon",
    category: "smoothies",
    price: 7,
    name: "Crazy Melon",
    description: {
      en: "67% melon, 13% mango, 10% strawberry, 10% passion fruit.",
      fr: "67% melon, 13% mangue, 10% fraise, 10% fruit de la passion.",
      de: "67% Melone, 13% Mango, 10% Erdbeere, 10% Passionsfrucht."
    }
  }),
  product({
    id: "absolut-vodka",
    category: "spiritueux",
    price: 7,
    name: "Absolut",
    description: {
      en: "Premium vodka serve with a clean, crisp finish.",
      fr: "Service vodka premium, net et élégant.",
      de: "Premium Vodka Service mit klarem, elegantem Finish."
    }
  }),
  product({
    id: "jack-daniels-original",
    category: "spiritueux",
    price: 7,
    name: "Jack Daniel's Original",
    description: {
      en: "Classic Tennessee whiskey with smooth oak and vanilla notes.",
      fr: "Whiskey du Tennessee classique, aux notes douces de chêne et vanille.",
      de: "Klassischer Tennessee Whiskey mit sanften Eichen- und Vanillenoten."
    }
  }),
  product({
    id: "jack-daniels-honey",
    category: "spiritueux",
    price: 7,
    name: "Jack Daniel's Honey",
    description: {
      en: "Tennessee whiskey with a soft honey finish.",
      fr: "Whiskey du Tennessee à la finale douce et miellée.",
      de: "Tennessee Whiskey mit weichem Honig-Finish."
    }
  }),
  product({
    id: "jack-daniels-apple",
    category: "spiritueux",
    price: 7,
    name: "Jack Daniel's Apple",
    description: {
      en: "Tennessee whiskey with crisp green apple notes.",
      fr: "Whiskey du Tennessee aux notes fraîches de pomme verte.",
      de: "Tennessee Whiskey mit frischen grünen Apfelnoten."
    }
  }),
  product({
    id: "gin",
    category: "spiritueux",
    price: 7,
    name: "Gin",
    description: {
      en: "Classic gin serve with a clean botanical profile.",
      fr: "Service gin classique au profil botanique net.",
      de: "Klassischer Gin Service mit klarem botanischem Profil."
    }
  }),
  product({
    id: "havana-club-rum",
    category: "spiritueux",
    price: 7,
    name: {
      en: "Havana Club",
      fr: "Rhum Havana Club",
      de: "Havana Club"
    },
    description: {
      en: "Cuban rum with warm, rounded lounge notes.",
      fr: "Rhum cubain aux notes chaudes et rondes.",
      de: "Kubanischer Rum mit warmen, runden Lounge-Noten."
    }
  }),
  product({
    id: "ciroc",
    category: "spiritueux",
    price: 10,
    name: "Cîroc",
    description: {
      en: "Ultra-premium vodka with a smooth, refined character.",
      fr: "Vodka ultra-premium au caractère doux et raffiné.",
      de: "Ultra-Premium Vodka mit weichem, raffiniertem Charakter."
    }
  }),
  product({
    id: "grey-goose",
    category: "spiritueux",
    price: 10,
    name: "Grey Goose",
    description: {
      en: "French premium vodka, elegant, smooth and crystalline.",
      fr: "Vodka premium française, élégante, douce et cristalline.",
      de: "Französischer Premium Vodka, elegant, weich und klar."
    }
  })
];
