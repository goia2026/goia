"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Cloud,
  Edit3,
  Eye,
  EyeOff,
  Globe2,
  Heart,
  Home,
  ImageIcon,
  Instagram,
  Plus,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X
} from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GoiaLogo } from "@/components/GoiaLogo";
import {
  Category,
  Locale,
  Product,
  categoryLabels,
  categoryOrder,
  initialProducts,
  uiCopy
} from "@/lib/menu-data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type View = "home" | "menu" | "favorites" | "admin";
type CategoryLabels = typeof categoryLabels;
type AppCopy = {
  followTitle: string;
  followSubtitle: string;
  reviewTitle: string;
  reviewSubtitle: string;
  heroSummary: (products: number, categories: number) => string;
  googleReview: string;
  categoryEyebrow: string;
  categoryTitle: string;
  categoryText: string;
  selections: string;
  readyProducts: string;
  featuredEyebrow: string;
  featuredTitle: string;
  section: string;
  empty: string;
  productSlot: string;
  readyToAdd: string;
  addFromStudio: string;
  menuFallback: string;
  premiumSmoke: string;
  goiaSelection: string;
  chichaIntro: string;
  items: string;
  featuredBadge: string;
  signatureBadge: string;
  signatureMixes: string;
  classicFlavors: string;
  photoReserved: string;
  instagramTitle: string;
  instagramText: string;
  adminDescription: string;
  reset: string;
  add: string;
  categories: string;
  categoryArchitecture: string;
  uploadImage: string;
  imageUrl: string;
  description: string;
  category: string;
  unavailable: string;
  available: string;
  delete: string;
  pricePlaceholder: string;
  ingredients: string;
  goiaSignature: string;
  bestSeller: string;
  premium: string;
  classic: string;
  allFlavors: string;
};

const reviewUrl =
  "https://www.google.com/maps/place//data=!4m3!3m2!1s0x4796cf800b7cf257:0x871ef082619b267!12e1?source=g.page.m._&laa=merchant-review-solicitation";
const instagramUrl = "https://www.instagram.com/goia.kehl/?hl=de";
const findUsUrl =
  "https://www.google.com/maps/search/?api=1&query=GOIA%20Huqqa%20Lounge%20Bahnhofstra%C3%9Fe%206%2077694%20Kehl";

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

const fractionalCurrency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const storageVersion = "goia-luxury-v11";
const localeStorageKey = "goia:locale";

const blankProduct = (): Product => ({
  id: `goia-${Date.now()}`,
  category: "chichas",
  price: 0,
  image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1400&q=85",
  signature: false,
  featured: false,
  available: true,
  name: { en: "New Product", fr: "Nouveau Produit", de: "Neues Produkt" },
  description: {
    en: "Add a short, premium description.",
    fr: "Ajoutez une description courte et premium.",
    de: "Füge eine kurze, hochwertige Beschreibung hinzu."
  }
});

const appCopy: Record<Locale, AppCopy> = {
  fr: {
    followTitle: "Suivre GOIA sur Instagram",
    followSubtitle: "Découvrez nos derniers événements, cocktails et l’atmosphère du lounge.",
    reviewTitle: "Laisser un avis Google",
    reviewSubtitle: "Partagez votre expérience chez GOIA.",
    heroSummary: (products: number, categories: number) =>
      `${products} sélections dans ${categories} catégories.`,
    googleReview: "Avis Google",
    categoryEyebrow: "Carte GOIA",
    categoryTitle: "Catégories premium",
    categoryText: "Neuf sections raffinées, prêtes pour la sélection GOIA.",
    selections: "sélections",
    readyProducts: "À venir",
    featuredEyebrow: "Nos incontournables",
    featuredTitle: "Les incontournables GOIA",
    section: "Section",
    empty: "À venir",
    productSlot: "Emplacement produit",
    readyToAdd: "À venir",
    addFromStudio: "Ajoutez le nom, le prix, l’image et la disponibilité depuis le Studio GOIA.",
    menuFallback: "La carte",
    premiumSmoke: "Chichas premium",
    goiaSelection: "Sélection GOIA",
    chichaIntro: "Service chicha GOIA avec présentation raffinée et tous les parfums disponibles.",
    items: "produits",
    featuredBadge: "Incontournable",
    signatureBadge: "Signature",
    signatureMixes: "Mixes Signature",
    classicFlavors: "Saveurs classiques",
    photoReserved: "Photo à venir",
    instagramTitle: "GOIA après la nuit",
    instagramText: "Suivez le lounge pour découvrir nos nouveautés, soirées et moments GOIA.",
    adminDescription:
      "Modifiez les catégories, produits, images, prix, mises en avant et disponibilités.",
    reset: "Réinitialiser",
    add: "Ajouter",
    categories: "Catégories",
    categoryArchitecture: "Architecture de la carte",
    uploadImage: "Ajouter une image",
    imageUrl: "URL de l’image",
    description: "Description",
    category: "Catégorie",
    unavailable: "Indisponible",
    available: "Disponible",
    delete: "Supprimer",
    pricePlaceholder: "Prix à venir",
    ingredients: "Ingrédients",
    goiaSignature: "GOIA Signature",
    bestSeller: "Best Seller",
    premium: "Premium",
    classic: "Classique",
    allFlavors: "Disponible avec tous nos goûts."
  },
  de: {
    followTitle: "GOIA auf Instagram folgen",
    followSubtitle: "Entdecke unsere neuesten Events, Cocktails und die Lounge-Atmosphäre.",
    reviewTitle: "Google Bewertung abgeben",
    reviewSubtitle: "Teile deine Erfahrung bei GOIA.",
    heroSummary: (products: number, categories: number) =>
      `${products} Auswahlmöglichkeiten in ${categories} Kategorien.`,
    googleReview: "Google Bewertung",
    categoryEyebrow: "GOIA Karte",
    categoryTitle: "Premium-Kategorien",
    categoryText: "Neun raffinierte Bereiche, vorbereitet für die GOIA Auswahl.",
    selections: "Auswahl",
    readyProducts: "Demnächst",
    featuredEyebrow: "Unsere Highlights",
    featuredTitle: "GOIA Highlights",
    section: "Bereich",
    empty: "Demnächst",
    productSlot: "Produktplatz",
    readyToAdd: "Demnächst",
    addFromStudio: "Name, Preis, Bild und Verfügbarkeit im GOIA Studio hinzufügen.",
    menuFallback: "Die Karte",
    premiumSmoke: "Premium Shishas",
    goiaSelection: "GOIA Auswahl",
    chichaIntro: "GOIA Shisha-Service mit edler Präsentation und allen verfügbaren Sorten.",
    items: "Produkte",
    featuredBadge: "Highlight",
    signatureBadge: "Signature",
    signatureMixes: "Signature Mixes",
    classicFlavors: "Klassische Sorten",
    photoReserved: "Foto folgt",
    instagramTitle: "GOIA nach Einbruch der Nacht",
    instagramText: "Folge der Lounge für Neuheiten, Abende und GOIA Momente.",
    adminDescription:
      "Kategorien, Produkte, Bilder, Preise, Highlights und Verfügbarkeiten bearbeiten.",
    reset: "Zurücksetzen",
    add: "Hinzufügen",
    categories: "Kategorien",
    categoryArchitecture: "Kartenstruktur",
    uploadImage: "Bild hinzufügen",
    imageUrl: "Bild-URL",
    description: "Beschreibung",
    category: "Kategorie",
    unavailable: "Nicht verfügbar",
    available: "Verfügbar",
    delete: "Löschen",
    pricePlaceholder: "Preis folgt",
    ingredients: "Zutaten",
    goiaSignature: "GOIA Signature",
    bestSeller: "Best Seller",
    premium: "Premium",
    classic: "Klassisch",
    allFlavors: "Mit allen unseren Sorten verfügbar."
  },
  en: {
    followTitle: "Follow GOIA on Instagram",
    followSubtitle: "Discover our latest events, cocktails and lounge atmosphere.",
    reviewTitle: "Leave a Google Review",
    reviewSubtitle: "Share your experience with GOIA.",
    heroSummary: (products: number, categories: number) =>
      `${products} selections across ${categories} categories.`,
    googleReview: "Google Review",
    categoryEyebrow: "GOIA Menu",
    categoryTitle: "Premium categories",
    categoryText: "Nine refined sections, prepared for the GOIA selection.",
    selections: "selections",
    readyProducts: "Coming soon",
    featuredEyebrow: "Featured",
    featuredTitle: "GOIA signatures",
    section: "Section",
    empty: "Coming soon",
    productSlot: "Product slot",
    readyToAdd: "Coming soon",
    addFromStudio: "Add name, price, image and availability from GOIA Studio.",
    menuFallback: "The menu",
    premiumSmoke: "Premium hookahs",
    goiaSelection: "GOIA Selection",
    chichaIntro: "GOIA hookah service with refined presentation and all available flavors.",
    items: "items",
    featuredBadge: "Featured",
    signatureBadge: "Signature",
    signatureMixes: "Signature Mixes",
    classicFlavors: "Classic Flavors",
    photoReserved: "Photo reserved",
    instagramTitle: "GOIA after dark",
    instagramText: "Follow the lounge for new flavors, evenings and GOIA moments.",
    adminDescription:
      "Edit categories, products, images, pricing, featured placement and availability.",
    reset: "Reset",
    add: "Add",
    categories: "Categories",
    categoryArchitecture: "Menu architecture",
    uploadImage: "Upload image",
    imageUrl: "Image URL",
    description: "Description",
    category: "Category",
    unavailable: "Unavailable",
    available: "Available",
    delete: "Delete",
    pricePlaceholder: "Price coming soon",
    ingredients: "Ingredients",
    goiaSignature: "GOIA Signature",
    bestSeller: "Best Seller",
    premium: "Premium",
    classic: "Classic",
    allFlavors: "Available with all our flavors."
  }
};

function formatProductPrice(product: Product, locale: Locale) {
  if (product.price <= 0) return appCopy[locale].pricePlaceholder;
  return Number.isInteger(product.price)
    ? currency.format(product.price)
    : fractionalCurrency.format(product.price);
}

function getProductBadge(product: Product, locale: Locale) {
  const c = appCopy[locale];

  if (product.badge === "premium") return `✨ ${c.premium}`;
  if (product.badge === "classic") return c.classic;
  if (product.badge === "best-seller") return `🔥 ${c.bestSeller}`;
  if (product.badge === "signature" || product.signature) return `⭐ ${c.goiaSignature}`;
  if (product.featured) return `🔥 ${c.bestSeller}`;
  if (product.badge) return product.badge;
  return "";
}

function isCategory(value: string): value is Category {
  return categoryOrder.includes(value as Category);
}

function isLocale(value: string): value is Locale {
  return value === "fr" || value === "de" || value === "en";
}

function normalizeProduct(product: Product, index = 0): Product {
  return {
    ...product,
    category: isCategory(product.category) ? product.category : "chichas",
    available: product.available ?? true,
    featured: product.featured ?? Boolean(product.signature)
  };
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [entered, setEntered] = useState(false);
  const [view, setView] = useState<View>("home");
  const [locale, setLocale] = useState<Locale>("fr");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("chichas");
  const [products, setProducts] = useState<Product[]>(initialProducts.map(normalizeProduct));
  const [labels, setLabels] = useState<CategoryLabels>(categoryLabels);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const t = uiCopy[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 950);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(localeStorageKey);
    if (savedLocale && isLocale(savedLocale)) {
      setLocale(savedLocale);
    }

    if (window.localStorage.getItem("goia:version") !== storageVersion) {
      window.localStorage.removeItem("goia:products");
      window.localStorage.removeItem("goia:categories");
      window.localStorage.removeItem("goia:favorites");
      window.localStorage.setItem("goia:version", storageVersion);
    }
    setFavorites(readJson<string[]>("goia:favorites", []));
    setLabels(readJson<CategoryLabels>("goia:categories", categoryLabels));
    setProducts(readJson<Product[]>("goia:products", initialProducts).map(normalizeProduct));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(localeStorageKey, locale);
  }, [locale]);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("products")
      .select("*")
      .then(({ data }) => {
        if (data?.length) setProducts((data as Product[]).map(normalizeProduct));
      });
  }, []);

  useEffect(() => {
    writeJson("goia:favorites", favorites);
  }, [favorites]);

  const visibleProducts = useMemo(
    () => products.filter((product) => product.available !== false),
    [products]
  );

  const featuredProducts = useMemo(
    () => visibleProducts.filter((product) => product.featured || product.signature).slice(0, 8),
    [visibleProducts]
  );

  const filteredProducts = useMemo(() => {
    const source = view === "admin" ? products : visibleProducts;
    const normalizedQuery = query.trim().toLowerCase();

    return source.filter((product) => {
      const categoryMatch = category === "all" || product.category === category;
      const favoriteMatch = view !== "favorites" || favorites.includes(product.id);
      const searchText = [
        product.name.en,
        product.name.fr,
        product.name.de,
        product.description.en,
        product.description.fr,
        product.description.de,
        labels[product.category][locale]
      ]
        .join(" ")
        .toLowerCase();

      return categoryMatch && favoriteMatch && searchText.includes(normalizedQuery);
    });
  }, [category, favorites, labels, locale, products, query, view, visibleProducts]);

  function enterLounge() {
    setEntered(true);
    setView("menu");
    setCategory("chichas");
  }

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  async function persistProduct(product: Product) {
    if (supabase) {
      await supabase.from("products").upsert(product);
    }
  }

  function persistProducts(nextProducts: Product[]) {
    setProducts(nextProducts);
    writeJson("goia:products", nextProducts);
  }

  async function updateProduct(id: string, patch: Partial<Product>) {
    const nextProducts = products.map((product) =>
      product.id === id ? normalizeProduct({ ...product, ...patch }) : product
    );
    persistProducts(nextProducts);

    const updatedProduct = nextProducts.find((product) => product.id === id);
    if (updatedProduct) {
      await persistProduct(updatedProduct);
    }
  }

  async function addProduct() {
    const product = blankProduct();
    const nextProducts = [product, ...products];
    persistProducts(nextProducts);
    await persistProduct(product);
  }

  async function deleteProduct(id: string) {
    const nextProducts = products.filter((product) => product.id !== id);
    persistProducts(nextProducts);
    setFavorites((current) => current.filter((item) => item !== id));
    if (supabase) {
      await supabase.from("products").delete().eq("id", id);
    }
  }

  async function resetProducts() {
    const reset = initialProducts.map(normalizeProduct);
    persistProducts(reset);
    setLabels(categoryLabels);
    window.localStorage.removeItem("goia:products");
    window.localStorage.removeItem("goia:categories");
    if (supabase) {
      await supabase.from("products").upsert(reset);
    }
  }

  function updateCategoryLabel(categoryId: Category, nextLabels: Partial<Record<Locale, string>>) {
    const updatedLabels = {
      ...labels,
      [categoryId]: { ...labels[categoryId], ...nextLabels }
    };
    setLabels(updatedLabels);
    writeJson("goia:categories", updatedLabels);
  }

  async function uploadProductImage(product: Product, file: File) {
    let image = await fileToDataUrl(file);

    if (supabase) {
      const extension = file.name.split(".").pop() || "jpg";
      const path = `${product.id}-${Date.now()}.${extension}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "31536000",
        upsert: true
      });
      if (!error) {
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        if (data.publicUrl) image = data.publicUrl;
      }
    }

    await updateProduct(product.id, { image });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-ink text-porcelain">
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>

      <AnimatePresence mode="wait">
        {!entered ? (
          <Landing
            key={`landing-${locale}`}
            locale={locale}
            setLocale={setLocale}
            onEnter={enterLounge}
          />
        ) : (
          <motion.section
            key={`app-${locale}`}
            initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
            transition={{ duration: 0.72, ease: luxuryEase }}
            className="relative min-h-screen pb-28"
          >
            <Header locale={locale} setLocale={setLocale} />

            <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-10 pt-28 sm:px-6 lg:gap-12 lg:px-8">
              <AppHero
                locale={locale}
                labels={labels}
                products={visibleProducts}
                title={view === "admin" ? t.editMenu : view === "favorites" ? t.favorites : t.menu}
                subtitle={view === "admin" ? "Studio GOIA" : "GOIA Huqqa Lounge"}
              />

              {view !== "admin" && (
                <SearchBar value={query} locale={locale} onChange={setQuery} />
              )}

              {view === "menu" && featuredProducts.length > 0 && (
                <FeaturedProducts
                  products={featuredProducts}
                  locale={locale}
                  labels={labels}
                  favorites={favorites}
                  onOpen={setSelectedProduct}
                  onToggleFavorite={toggleFavorite}
                />
              )}

              {view !== "admin" ? (
                <>
                  <CategoryCards
                    category={category}
                    locale={locale}
                    labels={labels}
                    products={visibleProducts}
                    setCategory={setCategory}
                  />
                  <ProductGrid
                    products={filteredProducts}
                    activeCategory={category === "all" ? null : category}
                    locale={locale}
                    labels={labels}
                    favorites={favorites}
                    emptyText={t.empty}
                    onOpen={setSelectedProduct}
                    onToggleFavorite={toggleFavorite}
                  />
                  <InstagramPanel locale={locale} />
                </>
              ) : (
                <AdminDashboard
                  locale={locale}
                  products={products}
                  labels={labels}
                  status={isSupabaseConfigured ? t.configured : t.localMode}
                  onAddProduct={addProduct}
                  onDeleteProduct={deleteProduct}
                  onImageUpload={uploadProductImage}
                  onResetProducts={resetProducts}
                  onUpdateCategoryLabel={updateCategoryLabel}
                  onUpdateProduct={updateProduct}
                />
              )}
            </section>

            <BottomNav
              view={view}
              t={t}
              onChange={(nextView) => {
                if (nextView === "home") {
                  setEntered(false);
                  return;
                }
                setView(nextView);
              }}
            />
          </motion.section>
        )}
      </AnimatePresence>

      <ProductGallery
        product={selectedProduct}
        locale={locale}
        labels={labels}
        favorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onToggleFavorite={toggleFavorite}
      />
    </main>
  );
}

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.05, ease: luxuryEase }}
      className="fixed inset-0 z-[80] grid place-items-center overflow-hidden bg-black"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.7, 0.56], scale: [0.8, 1.2, 1.08] }}
        transition={{ duration: 1.45, ease: luxuryEase }}
        className="absolute h-[28rem] w-[28rem] rounded-full bg-taupe/12 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: luxuryEase }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,118,101,0.16),transparent_30%,rgba(0,0,0,0.92)_72%)]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 18, filter: "blur(16px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.05, ease: luxuryEase }}
        className="relative flex flex-col items-center gap-7 will-change-transform"
      >
        <GoiaLogo mark />
        <div className="h-px w-56 overflow-hidden rounded-full bg-white/10 shadow-[0_0_40px_rgba(138,118,101,0.18)]">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "150%" }}
            transition={{ duration: 1.45, ease: luxuryEase }}
            className="h-full w-32 bg-gradient-to-r from-transparent via-white to-transparent"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Landing({
  locale,
  setLocale,
  onEnter
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  onEnter: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoResetTimeoutRef = useRef<number | null>(null);

  function restartWelcomeVideoAtFourteenSeconds(video: HTMLVideoElement | null) {
    if (video && video.currentTime >= 14) {
      if (videoResetTimeoutRef.current !== null) {
        window.clearTimeout(videoResetTimeoutRef.current);
        videoResetTimeoutRef.current = null;
      }
      video.currentTime = 0;
      void video.play();
    }
  }

  function scheduleWelcomeVideoRestart(video: HTMLVideoElement) {
    if (videoResetTimeoutRef.current !== null) {
      window.clearTimeout(videoResetTimeoutRef.current);
    }

    const millisecondsUntilRestart = Math.max(0, (14 - video.currentTime) * 1000);
    videoResetTimeoutRef.current = window.setTimeout(() => {
      video.currentTime = 0;
      void video.play();
      scheduleWelcomeVideoRestart(video);
    }, millisecondsUntilRestart);
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const welcomeVideo = video;

    function handleWelcomeVideoTimeUpdate() {
      restartWelcomeVideoAtFourteenSeconds(welcomeVideo);
    }

    function handleWelcomeVideoPlayback() {
      scheduleWelcomeVideoRestart(welcomeVideo);
    }

    welcomeVideo.loop = false;
    welcomeVideo.removeAttribute("loop");
    welcomeVideo.addEventListener("timeupdate", handleWelcomeVideoTimeUpdate);
    welcomeVideo.addEventListener("play", handleWelcomeVideoPlayback);
    welcomeVideo.addEventListener("seeked", handleWelcomeVideoPlayback);
    scheduleWelcomeVideoRestart(welcomeVideo);

    return () => {
      if (videoResetTimeoutRef.current !== null) {
        window.clearTimeout(videoResetTimeoutRef.current);
      }
      welcomeVideo.removeEventListener("timeupdate", handleWelcomeVideoTimeUpdate);
      welcomeVideo.removeEventListener("play", handleWelcomeVideoPlayback);
      welcomeVideo.removeEventListener("seeked", handleWelcomeVideoPlayback);
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, backgroundColor: "#000000" }}
      animate={{ opacity: 1, backgroundColor: "#080807" }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 1.25, ease: luxuryEase }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-5"
    >
      <motion.video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover opacity-75 will-change-transform"
        autoPlay
        muted
        playsInline
        onTimeUpdate={(event) => restartWelcomeVideoAtFourteenSeconds(event.currentTarget)}
        initial={{ scale: 1.06, y: 0, opacity: 0 }}
        animate={{ scale: [1.06, 1.13, 1.06], y: [0, -10, 0], opacity: 0.74 }}
        transition={{
          scale: { duration: 20, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 16, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1.8, ease: luxuryEase }
        }}
      >
        <source src="/goia-welcome.mp4" type="video/mp4" />
        <source src="/goia-welcome.webm" type="video/webm" />
        <source
          src="https://cdn.coverr.co/videos/coverr-pouring-a-drink-9747/1080p.mp4"
          type="video/mp4"
        />
      </motion.video>
      <div className="pointer-events-none absolute inset-0 bg-[rgba(0,0,0,0.58)]" />
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.7, ease: luxuryEase }}
        className="absolute inset-0 bg-black"
      />
      <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-taupe/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-96 w-96 rounded-full bg-white/8 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,118,101,0.10),rgba(0,0,0,0.34)_34%,rgba(0,0,0,0.92)_88%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink via-ink/70 to-transparent" />

      <div className="absolute right-4 top-4 z-10">
        <LanguageSwitch locale={locale} setLocale={setLocale} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18, filter: "blur(14px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.05, ease: luxuryEase }}
        className="relative z-10 flex min-h-screen w-full max-w-3xl flex-col items-center justify-center pb-24 pt-28 text-center will-change-transform"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.15, ease: luxuryEase }}
          className="relative flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.55, scale: 1 }}
            transition={{ duration: 1.2, ease: luxuryEase }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8A45B]/18 blur-3xl sm:h-64 sm:w-[30rem]"
          />
          <span className="relative text-[clamp(5.4rem,21.5vw,10.8rem)] font-semibold leading-none tracking-[0.08em] text-white drop-shadow-[0_18px_70px_rgba(0,0,0,0.85)]">
            GOIA
          </span>
          <span className="relative mt-2 text-sm font-light uppercase tracking-[0.48em] text-[#C8A45B] sm:text-base">
            HUQQA LOUNGE
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: luxuryEase }}
          className="mt-8 text-sm font-light leading-7 tracking-[0.18em] text-[#E6C675] sm:text-base sm:leading-8"
        >
          <span className="block">Luxury Huqqa Lounge</span>
          <span className="block text-white/72">Cocktails • Desserts • Premium Experience</span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.75, ease: luxuryEase }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          <span className="text-lg tracking-[0.2em] text-[#C8A45B] drop-shadow-[0_0_24px_rgba(200,164,91,0.35)]">
            ★★★★★
          </span>
          <span className="text-xs uppercase tracking-[0.22em] text-white/58">
            The Premium Lounge in Kehl
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.62, duration: 0.8, ease: luxuryEase }}
          className="mt-10"
        >
          <motion.button
            whileHover={{
              y: -3,
              boxShadow:
                "0 0 56px rgba(200,164,91,0.48), 0 28px 88px rgba(0,0,0,0.55)"
            }}
            whileTap={{ scale: 0.985 }}
            animate={{ y: [0, -2, 0] }}
            transition={{ delay: 1.35, duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            onClick={onEnter}
            className="inline-flex h-16 items-center gap-3 rounded-full border border-[#F3D891]/50 bg-[#C8A45B] px-9 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_38px_rgba(200,164,91,0.28),0_20px_70px_rgba(0,0,0,0.42)] transition duration-300 hover:bg-[#E5C779] sm:h-[4.5rem] sm:px-12 sm:text-base"
          >
            <span aria-hidden="true">→</span>
            ENTER THE MENU
          </motion.button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.85, duration: 0.85, ease: luxuryEase }}
          className="mt-7 grid w-full max-w-[36rem] gap-3 px-1 sm:grid-cols-3"
        >
          <LandingGlassButton href={instagramUrl} icon="📸" label="Instagram" />
          <LandingGlassButton href={reviewUrl} icon="⭐" label="Google Reviews" />
          <LandingGlassButton href={findUsUrl} icon="📍" label="Find Us" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8, ease: luxuryEase }}
          className="absolute bottom-3 left-1/2 w-full max-w-xs -translate-x-1/2 px-4 text-center text-xs leading-6 tracking-[0.16em] text-white/58 sm:bottom-4 sm:max-w-md"
        >
          <div className="mx-auto mb-4 h-px w-24 bg-gradient-to-r from-transparent via-[#C8A45B]/70 to-transparent shadow-[0_0_18px_rgba(200,164,91,0.28)]" />
          <p>Bahnhofstraße 6</p>
          <p>77694 Kehl</p>
          <p className="mt-2 text-white/44">Open every day until late.</p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function LandingGlassButton({
  href,
  icon,
  label
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -4, scale: 1.018 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.28, ease: luxuryEase }}
      className="group relative overflow-hidden rounded-2xl border border-[#C8A45B]/24 bg-white/[0.075] px-4 py-4 text-center shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition duration-300 hover:border-[#C8A45B]/60 hover:bg-[#C8A45B]/12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(200,164,91,0.16),rgba(255,255,255,0.07)_42%,rgba(0,0,0,0)_78%)] opacity-60 transition duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-[#C8A45B]/16 blur-2xl transition duration-500 group-hover:bg-[#C8A45B]/26" />
      <span className="relative flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-white/86 transition duration-300 group-hover:text-[#F4D989]">
        <span className="text-base" aria-hidden="true">
          {icon}
        </span>
        {label}
      </span>
    </motion.a>
  );
}

function Header({
  locale,
  setLocale
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 px-4 pt-4 sm:px-6">
      <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-[1.75rem] px-4 py-3 sm:rounded-full">
        <GoiaLogo compact />
        <div className="flex items-center gap-2">
          <SocialButton
            href={reviewUrl}
            label={appCopy[locale].reviewTitle}
            icon={<Star size={17} />}
          />
          <SocialButton href={instagramUrl} label="Instagram" icon={<Instagram size={17} />} />
          <LanguageSwitch locale={locale} setLocale={setLocale} />
        </div>
      </div>
    </header>
  );
}

function AppHero({
  locale,
  labels,
  products,
  title,
  subtitle
}: {
  locale: Locale;
  labels: CategoryLabels;
  products: Product[];
  title: string;
  subtitle: string;
}) {
  const categoriesInUse = new Set(products.map((product) => labels[product.category][locale]));
  const c = appCopy[locale];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: luxuryEase }}
      className="grid gap-5 lg:grid-cols-[1fr_22rem] lg:items-end"
    >
      <div>
        <p className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-taupe">
          <Sparkles size={15} />
          {subtitle}
        </p>
        <h1 className="text-5xl font-semibold leading-none text-white sm:text-7xl">{title}</h1>
      </div>
      <div className="glass rounded-[1.5rem] p-5">
        <p className="text-sm leading-6 text-white/58">
          {c.heroSummary(products.length, categoriesInUse.size)}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-ink"
          >
            <Star size={16} />
            {c.googleReview}
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-white/10 text-sm text-white/72"
          >
            <Instagram size={16} />
            Instagram
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function SearchBar({
  value,
  locale,
  onChange
}: {
  value: string;
  locale: Locale;
  onChange: (value: string) => void;
}) {
  return (
    <div className="glass flex items-center gap-3 rounded-full px-4 py-3">
      <Search className="shrink-0 text-taupe" size={20} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={uiCopy[locale].search}
        className="h-11 min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/42"
      />
    </div>
  );
}

function LanguageSwitch({
  locale,
  setLocale
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  const languages: Array<{ id: Locale; label: string; short: string }> = [
    { id: "fr", label: "Français", short: "🇫🇷" },
    { id: "de", label: "Deutsch", short: "🇩🇪" },
    { id: "en", label: "English", short: "🇬🇧" }
  ];

  return (
    <div className="glass flex min-h-11 items-center rounded-full border border-[#C8A45B]/18 px-1.5 py-1 shadow-[0_16px_55px_rgba(0,0,0,0.28)]">
      <Globe2 className="ml-2 mr-1 hidden text-[#C8A45B] sm:block" size={16} />
      {languages.map((item) => (
        <button
          key={item.id}
          onClick={() => setLocale(item.id)}
          className={[
            "flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition sm:px-3",
            locale === item.id
              ? "bg-[#C8A45B] text-black shadow-[0_0_24px_rgba(200,164,91,0.24)]"
              : "text-white/62 hover:bg-white/8 hover:text-white"
          ].join(" ")}
        >
          <span>{item.short}</span>
          <span className="hidden sm:inline">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function SocialButton({
  href,
  label,
  icon
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/72 transition hover:border-taupe/50 hover:bg-white/10 hover:text-white sm:flex"
    >
      {icon}
    </a>
  );
}

const categoryDescriptions: Record<Category, Record<Locale, string>> = {
  chichas: {
    fr: "Rituels raffinés, fumée douce et mélanges premium.",
    de: "Raffinierte Rituale, sanfter Rauch und Premium-Mischungen.",
    en: "Refined rituals, smooth smoke and premium blends."
  },
  "softs-juices": {
    fr: "Softs, jus et boissons fraîches servis avec élégance.",
    de: "Softdrinks, Säfte und erfrischende Getränke, elegant serviert.",
    en: "Soft drinks, juices and chilled refreshments served with polish."
  },
  "hot-drinks": {
    fr: "Thés, cafés et boissons chaudes pour prolonger le moment.",
    de: "Tee, Kaffee und Heißgetränke für einen ruhigen Moment.",
    en: "Teas, coffees and warm drinks for a slower lounge moment."
  },
  cocktails: {
    fr: "Classiques élégants, créations maison et services dorés.",
    de: "Elegante Klassiker, Hauskreationen und goldene Serves.",
    en: "Elegant classics, house creations and golden serves."
  },
  mocktails: {
    fr: "Compositions sans alcool, fraîches et parfaitement travaillées.",
    de: "Alkoholfreie Kompositionen, frisch und fein abgestimmt.",
    en: "Alcohol-free compositions, fresh and carefully crafted."
  },
  milkshakes: {
    fr: "Textures veloutées, notes gourmandes et finitions dessert.",
    de: "Samtige Texturen, süße Noten und Dessert-Finishes.",
    en: "Velvet textures, sweet notes and dessert finishes."
  },
  smoothies: {
    fr: "Fruits frais, fraîcheur légère et énergie lounge.",
    de: "Frische Früchte, leichte Frische und Lounge-Energie.",
    en: "Fresh fruit, light freshness and lounge energy."
  },
  spiritueux: {
    fr: "Bouteilles premium, services raffinés et sélections nocturnes.",
    de: "Premium-Flaschen, raffinierte Serves und Abendselektionen.",
    en: "Premium bottles, refined serves and after-dark selections."
  },
  boissons: {
    fr: "Boissons fraîches, eaux et essentiels de table.",
    de: "Erfrischungen, Wasser und Tischklassiker.",
    en: "Fresh drinks, waters and table essentials."
  },
  desserts: {
    fr: "Douceurs finales pensées pour le partage.",
    de: "Süße Abschlüsse, gemacht zum Teilen.",
    en: "Sweet finales designed for sharing."
  },
  "goia-signatures": {
    fr: "Les créations les plus distinctives de la maison GOIA.",
    de: "Die markantesten Kreationen des Hauses GOIA.",
    en: "The most distinctive creations from GOIA."
  }
};

const signatureMixes = [
  {
    name: "Black Nana",
    notes: {
      fr: "Menthe fraîche • Raisin noir",
      de: "Frische Minze • Schwarze Traube",
      en: "Fresh mint • Black grape"
    }
  },
  {
    name: "Mi Amor",
    notes: {
      fr: "Banane • Ananas • Menthe",
      de: "Banane • Ananas • Minze",
      en: "Banana • Pineapple • Mint"
    }
  },
  {
    name: "Watermelon",
    notes: {
      fr: "Menthe • Pastèque",
      de: "Minze • Wassermelone",
      en: "Mint • Watermelon"
    }
  },
  {
    name: "Love 66",
    notes: {
      fr: "Melon • Pastèque • Fruit de la passion",
      de: "Melone • Wassermelone • Passionsfrucht",
      en: "Melon • Watermelon • Passion fruit"
    },
    badge: "best-seller"
  },
  {
    name: "Hawaï",
    notes: {
      fr: "Mangue • Ananas • Menthe",
      de: "Mango • Ananas • Minze",
      en: "Mango • Pineapple • Mint"
    }
  },
  {
    name: "Fraise Banane",
    notes: {
      fr: "Fraise • Banane",
      de: "Erdbeere • Banane",
      en: "Strawberry • Banana"
    }
  },
  {
    name: "Lady Killer",
    notes: {
      fr: "Mangue • Melon • Fraise",
      de: "Mango • Melone • Erdbeere",
      en: "Mango • Melon • Strawberry"
    },
    badge: "best-seller"
  },
  {
    name: "Menthe Mangue",
    notes: {
      fr: "Mangue • Ananas",
      de: "Mango • Ananas",
      en: "Mango • Pineapple"
    }
  },
  {
    name: "African Queen",
    notes: {
      fr: "Cocktail de fruits frais sucrés",
      de: "Süßer Cocktail aus frischen Früchten",
      en: "Sweet cocktail of fresh fruits"
    },
    badge: "signature"
  },
  {
    name: "Ice Kaktus",
    notes: {
      fr: "Kaktus glacé",
      de: "Eisgekühlter Kaktus",
      en: "Iced cactus"
    }
  },
  {
    name: "Blue Mistery",
    notes: {
      fr: "Myrtilles • Menthe légère",
      de: "Blaubeeren • Leichte Minze",
      en: "Blueberries • Light mint"
    }
  }
];

const classicChichaFlavors = [
  { fr: "Menthe", de: "Minze", en: "Mint" },
  { fr: "Menthe Sucrée", de: "Süße Minze", en: "Sweet Mint" },
  { fr: "Double Pomme", de: "Doppelapfel", en: "Double Apple" },
  { fr: "Framboise", de: "Himbeere", en: "Raspberry" },
  { fr: "Kiwi", de: "Kiwi", en: "Kiwi" },
  { fr: "Citron", de: "Zitrone", en: "Lemon" },
  { fr: "Arlequin", de: "Harlekin", en: "Harlequin" },
  { fr: "Ananas", de: "Ananas", en: "Pineapple" },
  { fr: "Pomme Sucrée", de: "Süßer Apfel", en: "Sweet Apple" },
  { fr: "Pêche", de: "Pfirsich", en: "Peach" }
];

function getCategoryIcon(category: Category) {
  switch (category) {
    case "chichas":
      return <span className="text-[1.2rem] leading-none">💨</span>;
    case "softs-juices":
      return <span className="text-[1.2rem] leading-none">🥤</span>;
    case "hot-drinks":
      return <span className="text-[1.2rem] leading-none">☕</span>;
    case "cocktails":
      return <span className="text-[1.2rem] leading-none">🍸</span>;
    case "mocktails":
      return <span className="text-[1.2rem] leading-none">🍹</span>;
    case "milkshakes":
      return <span className="text-[1.2rem] leading-none">🥛</span>;
    case "smoothies":
      return <span className="text-[1.2rem] leading-none">🥭</span>;
    case "spiritueux":
      return <span className="text-[1.2rem] leading-none">🥃</span>;
    case "boissons":
      return <span className="text-[1.2rem] leading-none">🥤</span>;
    case "desserts":
      return <span className="text-[1.2rem] leading-none">🍰</span>;
    case "goia-signatures":
      return <span className="text-[1.2rem] leading-none">✨</span>;
  }
}

function CategoryCards({
  category,
  locale,
  labels,
  products,
  setCategory
}: {
  category: Category | "all";
  locale: Locale;
  labels: CategoryLabels;
  products: Product[];
  setCategory: (category: Category | "all") => void;
}) {
  const c = appCopy[locale];
  const categoryCards = categoryOrder.map((item) => {
    const categoryProducts = products.filter((product) => product.category === item);
    return {
      id: item,
      image: categoryProducts[0]?.image || products[0]?.image || "",
      count: categoryProducts.length,
      label: labels[item][locale],
      description: categoryDescriptions[item][locale]
    };
  });

  return (
    <section className="grid gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#C8A45B]">{c.categoryEyebrow}</p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {c.categoryTitle}
          </h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm leading-6 text-white/46 sm:block">
          {c.categoryText}
        </p>
      </div>

      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-3 xl:grid-cols-5">
        {categoryCards.map((item) => (
          <CategoryCard
            key={item.id}
            active={category === item.id}
            count={item.count}
            countLabel={c.selections}
            readyLabel={c.readyProducts}
            description={item.description}
            image={item.image}
            icon={getCategoryIcon(item.id)}
            label={item.label}
            eyebrow="GOIA"
            onClick={() => setCategory(item.id)}
          />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({
  active,
  count,
  countLabel,
  readyLabel,
  description,
  eyebrow,
  image,
  icon,
  label,
  onClick
}: {
  active: boolean;
  count: number;
  countLabel: string;
  readyLabel: string;
  description: string;
  eyebrow: string;
  image: string;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      layout
      whileTap={{ scale: 0.985 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className={[
        "group relative h-52 w-[78vw] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border text-left shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition sm:h-56 sm:w-auto",
        active
          ? "border-[#C8A45B]/70 bg-black/62"
          : "border-[#C8A45B]/18 bg-black/42 hover:border-[#C8A45B]/48"
      ].join(" ")}
    >
      {image && (
        <ProductImage
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full opacity-62 transition duration-700 group-hover:scale-105 group-hover:opacity-78"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8A45B]/16 via-black/58 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(200,164,91,0.22),transparent_42%)]" />
      <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[#C8A45B]/12 blur-2xl transition duration-500 group-hover:bg-[#C8A45B]/20" />
      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#C8A45B]/35 bg-[#C8A45B]/12 text-[#C8A45B] shadow-[0_0_34px_rgba(200,164,91,0.16)] transition duration-300 group-hover:text-[#F2D991]">
            {icon}
          </span>
          <span
            className={[
              "rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] transition",
              active
                ? "border-[#C8A45B]/60 bg-[#C8A45B]/16 text-[#F2D991]"
                : "border-white/10 bg-black/24 text-white/48"
            ].join(" ")}
          >
            {eyebrow}
          </span>
        </div>
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#C8A45B]">
            {count > 0 ? `${count} ${countLabel}` : readyLabel}
          </p>
          <h3 className="mt-2 text-2xl font-semibold leading-none text-white">{label}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/54">{description}</p>
        </div>
      </div>
    </motion.button>
  );
}

function FeaturedProducts({
  products,
  locale,
  labels,
  favorites,
  onOpen,
  onToggleFavorite
}: {
  products: Product[];
  locale: Locale;
  labels: CategoryLabels;
  favorites: string[];
  onOpen: (product: Product) => void;
  onToggleFavorite: (id: string) => void;
}) {
  const c = appCopy[locale];

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-taupe">{c.featuredEyebrow}</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{c.featuredTitle}</h2>
        </div>
        <BadgeCheck className="text-taupe" size={24} />
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {products.map((product) => {
          const badge = getProductBadge(product, locale);

          return (
          <motion.article
            key={product.id}
            layoutId={`featured-${product.id}`}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpen(product)}
            className="relative h-[24rem] w-[82vw] max-w-[28rem] shrink-0 snap-center overflow-hidden rounded-[2rem] border border-[#C8A45B]/18 bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:w-[26rem]"
          >
            {product.image ? (
              <ProductImage src={product.image} alt={product.name[locale]} className="h-full w-full" />
            ) : (
              <ProductPhotoPlaceholder
                icon={getCategoryIcon(product.category)}
                label={product.name[locale]}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/18 to-transparent" />
            <span className="absolute right-4 top-4 rounded-full border border-[#C8A45B]/45 bg-[#C8A45B]/95 px-4 py-2 text-sm font-semibold text-black shadow-[0_0_34px_rgba(200,164,91,0.28)] backdrop-blur-xl">
              {formatProductPrice(product, locale)}
            </span>
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-[#C8A45B]/30 bg-black/42 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#F2D991] backdrop-blur-xl">
              {getCategoryIcon(product.category)}
              {labels[product.category][locale]}
            </span>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onToggleFavorite(product.id);
              }}
              aria-label="Favorite"
              className="absolute right-4 top-16 flex h-12 w-12 items-center justify-center rounded-full bg-black/38 text-white backdrop-blur-xl transition hover:bg-white hover:text-ink"
            >
              <Heart size={20} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
            </button>
            {badge && (
              <span className="absolute bottom-32 left-5 rounded-full border border-[#C8A45B]/45 bg-black/38 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#F2D991] shadow-[0_0_30px_rgba(200,164,91,0.18)] backdrop-blur-xl">
                {badge}
              </span>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-taupe">
                {labels[product.category][locale]}
              </p>
              <div className="mt-2 rounded-[1.25rem] bg-gradient-to-r from-black/58 via-black/26 to-transparent p-3">
                <h3 className="text-3xl font-semibold leading-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]">
                  {product.name[locale]}
                </h3>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/66">
                {product.description[locale]}
              </p>
            </div>
          </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function ProductGrid({
  products,
  activeCategory,
  locale,
  labels,
  favorites,
  emptyText,
  onOpen,
  onToggleFavorite
}: {
  products: Product[];
  activeCategory: Category | null;
  locale: Locale;
  labels: CategoryLabels;
  favorites: string[];
  emptyText: string;
  onOpen: (product: Product) => void;
  onToggleFavorite: (id: string) => void;
}) {
  const c = appCopy[locale];

  if (!products.length) {
    const placeholderTitle = activeCategory ? labels[activeCategory][locale] : "GOIA";
    const placeholderDescription = activeCategory
      ? categoryDescriptions[activeCategory][locale]
      : emptyText;

    return (
      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-4 border-t border-[#C8A45B]/18 pt-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#C8A45B]">{c.section}</p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {placeholderTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/52">
              {placeholderDescription}
            </p>
          </div>
          <span className="hidden rounded-full border border-[#C8A45B]/25 bg-[#C8A45B]/10 px-4 py-2 text-sm text-[#F2D991] backdrop-blur-xl sm:inline-flex">
            {c.empty}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item * 0.08, duration: 0.45, ease: luxuryEase }}
              className="relative min-h-52 overflow-hidden rounded-[1.75rem] border border-[#C8A45B]/16 bg-black/42 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#C8A45B]/12 blur-2xl" />
              <div className="relative flex h-full flex-col justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C8A45B]/28 bg-[#C8A45B]/10 text-[#C8A45B]">
                  {activeCategory ? getCategoryIcon(activeCategory) : <Sparkles size={20} />}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#C8A45B]">
                    {c.productSlot}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{c.readyToAdd}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/50">
                    {c.addFromStudio}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  const sectionTitle = activeCategory ? labels[activeCategory][locale] : c.menuFallback;
  const isChichasPage = activeCategory === "chichas";

  return (
    <motion.section
      key={`products-${activeCategory ?? "all"}`}
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.48, ease: luxuryEase }}
      className="grid gap-5"
    >
      <div className="flex items-end justify-between gap-4 border-t border-[#C8A45B]/18 pt-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#C8A45B]">
            {isChichasPage ? c.premiumSmoke : c.goiaSelection}
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {sectionTitle}
          </h2>
          {isChichasPage && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/54">
              {c.chichaIntro}
            </p>
          )}
        </div>
        <p className="rounded-full border border-[#C8A45B]/25 bg-[#C8A45B]/10 px-4 py-2 text-sm text-[#F2D991] backdrop-blur-xl">
          {products.length} {c.items}
        </p>
      </div>

      <motion.div layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {products.map((product) => {
            const badge = getProductBadge(product, locale);

            return (
            <motion.article
              layout
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              whileHover={{ y: -8, scale: 1.012 }}
              transition={{ duration: 0.48, ease: luxuryEase }}
              onClick={() => onOpen(product)}
              className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#C8A45B]/18 bg-black/54 shadow-[0_24px_90px_rgba(0,0,0,0.46)] backdrop-blur-2xl transition hover:border-[#C8A45B]/50 hover:shadow-[0_34px_120px_rgba(0,0,0,0.58)]"
            >
              <div className="pointer-events-none absolute -inset-12 bg-[radial-gradient(circle_at_50%_20%,rgba(200,164,91,0.24),transparent_42%)] opacity-60 blur-2xl transition duration-500 group-hover:opacity-95" />
              <div className="relative h-[22rem] overflow-hidden bg-black sm:h-[24rem]">
                {product.image ? (
                  <ProductImage
                    src={product.image}
                    alt={product.name[locale]}
                    className="h-full w-full transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <ProductPhotoPlaceholder
                    icon={getCategoryIcon(product.category)}
                    label={product.name[locale]}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/10 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-[#C8A45B]/30 bg-black/42 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#F2D991] backdrop-blur-xl">
                  {getCategoryIcon(product.category)}
                  {labels[product.category][locale]}
                </span>
                <span className="absolute right-4 top-4 rounded-full border border-[#C8A45B]/45 bg-[#C8A45B]/95 px-4 py-2 text-sm font-semibold text-black shadow-[0_0_34px_rgba(200,164,91,0.28)] backdrop-blur-xl">
                  {formatProductPrice(product, locale)}
                </span>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(product.id);
                  }}
                  aria-label="Favorite"
                  className="absolute right-4 top-16 flex h-11 w-11 items-center justify-center rounded-full bg-black/38 text-white backdrop-blur-xl transition hover:bg-white hover:text-ink"
                >
                  <Heart
                    size={19}
                    fill={favorites.includes(product.id) ? "currentColor" : "none"}
                  />
                </button>
                {badge && (
                  <span className="absolute bottom-4 left-4 rounded-full border border-[#C8A45B]/45 bg-black/38 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#F2D991] shadow-[0_0_30px_rgba(200,164,91,0.18)] backdrop-blur-xl">
                    {badge}
                  </span>
                )}
              </div>
              <div className="relative flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1 rounded-[1.25rem] bg-gradient-to-r from-black/50 via-black/22 to-transparent p-3 -m-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#C8A45B]">
                      {labels[product.category][locale]}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold leading-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]">
                      {product.name[locale]}
                    </h2>
                    {product.category === "chichas" && (
                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-white/46">
                        {c.allFlavors}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-5 min-h-12 text-sm leading-6 text-white/60">
                  {product.description[locale]}
                </p>
                {product.ingredients && (
                  <div className="mt-4 rounded-[1.15rem] border border-[#C8A45B]/18 bg-[#C8A45B]/[0.06] p-3">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#C8A45B]">
                      {c.ingredients}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-white/54">
                      {product.ingredients[locale]}
                    </p>
                  </div>
                )}
              </div>
            </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {isChichasPage && <ChichaFlavorSection locale={locale} />}
    </motion.section>
  );
}

function ChichaFlavorSection({ locale }: { locale: Locale }) {
  const c = appCopy[locale];

  return (
    <div className="grid gap-5">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: luxuryEase }}
        className="relative overflow-hidden rounded-[2rem] border border-[#C8A45B]/18 bg-black/46 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-6"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#C8A45B]/12 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.28em] text-[#C8A45B]">GOIA Chichas</p>
          <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            {c.signatureMixes}
          </h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {signatureMixes.map((mix, index) => (
              <motion.article
                key={mix.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ delay: index * 0.035, duration: 0.38, ease: luxuryEase }}
                className="group relative min-h-36 overflow-hidden rounded-[1.35rem] border border-[#C8A45B]/18 bg-black/46 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition hover:border-[#C8A45B]/45"
              >
                <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-[#C8A45B]/10 blur-2xl transition group-hover:bg-[#C8A45B]/18" />
                <div className="relative flex h-full flex-col justify-between gap-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C8A45B]/30 bg-[#C8A45B]/10 text-[#C8A45B]">
                      <Cloud size={19} strokeWidth={1.7} />
                    </span>
                    {mix.badge && (
                      <span className="rounded-full border border-[#C8A45B]/40 bg-[#C8A45B]/12 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#F2D991]">
                        {mix.badge === "signature"
                          ? `⭐ ${c.goiaSignature}`
                          : `🔥 ${c.bestSeller}`}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold leading-tight text-white">{mix.name}</h4>
                    <p className="mt-2 text-sm leading-6 text-white/58">{mix.notes[locale]}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.55, ease: luxuryEase }}
        className="relative overflow-hidden rounded-[2rem] border border-[#C8A45B]/18 bg-black/38 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)] backdrop-blur-2xl sm:p-6"
      >
        <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-[#C8A45B]/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.28em] text-[#C8A45B]">GOIA Chichas</p>
          <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            {c.classicFlavors}
          </h3>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {classicChichaFlavors.map((flavor, index) => (
              <motion.span
                key={flavor.fr}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035, duration: 0.35, ease: luxuryEase }}
                className="rounded-full border border-[#C8A45B]/48 bg-[#C8A45B]/8 px-4 py-2 text-sm font-medium text-[#F2D991] shadow-[0_0_28px_rgba(200,164,91,0.08)] backdrop-blur-xl"
              >
                {flavor[locale]}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function ProductPhotoPlaceholder({
  compact = false,
  icon,
  label = appCopy.fr.photoReserved
}: {
  compact?: boolean;
  icon?: ReactNode;
  label?: string;
}) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_32%,rgba(200,164,91,0.24),rgba(0,0,0,0.88)_58%)]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(200,164,91,0.12),transparent_42%,rgba(255,255,255,0.04))]" />
      <div className="absolute h-40 w-40 rounded-full border border-[#C8A45B]/12" />
      <div className="absolute h-64 w-64 rounded-full border border-white/[0.04]" />
      <div className="grid place-items-center gap-3 text-center">
        <span
          className={[
            "flex items-center justify-center rounded-full border border-[#C8A45B]/35 bg-[#C8A45B]/10 text-[#C8A45B] shadow-[0_0_44px_rgba(200,164,91,0.18)]",
            compact ? "h-12 w-12" : "h-16 w-16"
          ].join(" ")}
        >
          {icon || <Sparkles size={compact ? 22 : 28} strokeWidth={1.6} />}
        </span>
        <span className="max-w-[12rem] text-xs uppercase tracking-[0.22em] text-[#F2D991]">
          {label}
        </span>
      </div>
    </div>
  );
}

function ProductGallery({
  product,
  locale,
  labels,
  favorite,
  onClose,
  onToggleFavorite
}: {
  product: Product | null;
  locale: Locale;
  labels: CategoryLabels;
  favorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}) {
  const c = appCopy[locale];
  const galleryBadge = product ? getProductBadge(product, locale) : "";

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/86 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 14 }}
            transition={{ duration: 0.55, ease: luxuryEase }}
            className="relative grid min-h-screen lg:grid-cols-[1.2fr_0.8fr]"
          >
            <div className="relative min-h-[58vh] overflow-hidden lg:min-h-screen">
              {product.image ? (
                <ProductImage
                  src={product.image}
                  alt={product.name[locale]}
                  className="gallery-image-open h-full w-full"
                />
              ) : (
                <ProductPhotoPlaceholder
                  icon={getCategoryIcon(product.category)}
                  label={product.name[locale]}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-black/24" />
              <span className="absolute right-5 top-5 rounded-full border border-[#C8A45B]/45 bg-[#C8A45B]/95 px-5 py-2.5 text-sm font-semibold text-black shadow-[0_0_34px_rgba(200,164,91,0.28)] backdrop-blur-xl">
                {formatProductPrice(product, locale)}
              </span>
            </div>
            <div className="flex flex-col justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(138,118,101,0.16),transparent_22rem)] p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A45B]/28 bg-[#C8A45B]/10 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-[#F2D991]">
                  {getCategoryIcon(product.category)}
                  {labels[product.category][locale]}
                </span>
                {galleryBadge && (
                  <span className="inline-flex rounded-full border border-[#C8A45B]/35 bg-[#C8A45B]/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-black">
                    {galleryBadge}
                  </span>
                )}
              </div>
              <div className="mt-4 rounded-[1.5rem] bg-gradient-to-r from-black/50 via-black/22 to-transparent p-4 -mx-4">
                <h2 className="text-5xl font-semibold leading-none text-white drop-shadow-[0_2px_22px_rgba(0,0,0,0.5)] sm:text-7xl">
                  {product.name[locale]}
                </h2>
              </div>
              <p className="mt-5 text-lg leading-8 text-white/66">{product.description[locale]}</p>
              {product.ingredients && (
                <div className="mt-6 rounded-[1.5rem] border border-[#C8A45B]/20 bg-black/28 p-5 backdrop-blur-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C8A45B]">
                    {c.ingredients}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/62">
                    {product.ingredients[locale]}
                  </p>
                </div>
              )}
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <p className="text-3xl font-semibold text-white">
                  {formatProductPrice(product, locale)}
                </p>
                <button
                  onClick={() => onToggleFavorite(product.id)}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink"
                  aria-label="Favorite"
                >
                  <Heart size={20} fill={favorite ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </motion.div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-glass"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InstagramPanel({ locale }: { locale: Locale }) {
  const c = appCopy[locale];

  return (
    <section className="glass grid gap-5 rounded-[2rem] p-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-taupe">
          {uiCopy[locale].instagram}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{c.instagramTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-white/58">
          {c.instagramText}
        </p>
      </div>
      <a
        href={instagramUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink"
      >
        <Instagram size={17} />
        Instagram
      </a>
    </section>
  );
}

function AdminDashboard({
  locale,
  products,
  labels,
  status,
  onAddProduct,
  onDeleteProduct,
  onImageUpload,
  onResetProducts,
  onUpdateCategoryLabel,
  onUpdateProduct
}: {
  locale: Locale;
  products: Product[];
  labels: CategoryLabels;
  status: string;
  onAddProduct: () => void;
  onDeleteProduct: (id: string) => void;
  onImageUpload: (product: Product, file: File) => void;
  onResetProducts: () => void;
  onUpdateCategoryLabel: (categoryId: Category, labels: Partial<Record<Locale, string>>) => void;
  onUpdateProduct: (id: string, patch: Partial<Product>) => void;
}) {
  const t = uiCopy[locale];
  const c = appCopy[locale];

  return (
    <div className="grid gap-5">
      <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-taupe">Studio GOIA</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{t.editMenu}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/52">
            {c.adminDescription}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-taupe/40 px-4 py-2 text-sm text-white/72">
            {status}
          </span>
          <button
            onClick={onResetProducts}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-white/72 transition hover:border-taupe/50 hover:bg-white/10 hover:text-white"
          >
            <RotateCcw size={16} />
            {c.reset}
          </button>
          <button
            onClick={onAddProduct}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink transition hover:bg-porcelain"
          >
            <Plus size={16} />
            {c.add}
          </button>
        </div>
      </div>

      <CategoryEditor locale={locale} labels={labels} onUpdate={onUpdateCategoryLabel} />

      <div className="grid gap-4">
        {products.map((product) => (
          <AdminProductEditor
            key={product.id}
            locale={locale}
            labels={labels}
            product={product}
            onDeleteProduct={onDeleteProduct}
            onImageUpload={onImageUpload}
            onUpdateProduct={onUpdateProduct}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryEditor({
  locale,
  labels,
  onUpdate
}: {
  locale: Locale;
  labels: CategoryLabels;
  onUpdate: (categoryId: Category, labels: Partial<Record<Locale, string>>) => void;
}) {
  const c = appCopy[locale];

  return (
    <section className="glass rounded-[1.75rem] p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-taupe">{c.categories}</p>
          <h3 className="mt-1 text-xl font-semibold text-white">{c.categoryArchitecture}</h3>
        </div>
        <Edit3 className="text-taupe" size={20} />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {categoryOrder.map((categoryId) => (
          <label
            key={categoryId}
            className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs uppercase tracking-[0.18em] text-white/42"
          >
            {categoryId}
            <input
              value={labels[categoryId][locale]}
              onChange={(event) => onUpdate(categoryId, { [locale]: event.target.value })}
              className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm normal-case tracking-normal text-white outline-none focus:border-taupe/70"
            />
          </label>
        ))}
      </div>
    </section>
  );
}

function AdminProductEditor({
  locale,
  labels,
  product,
  onDeleteProduct,
  onImageUpload,
  onUpdateProduct
}: {
  locale: Locale;
  labels: CategoryLabels;
  product: Product;
  onDeleteProduct: (id: string) => void;
  onImageUpload: (product: Product, file: File) => void;
  onUpdateProduct: (id: string, patch: Partial<Product>) => void;
}) {
  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onImageUpload(product, file);
    event.target.value = "";
  }
  const t = uiCopy[locale];
  const c = appCopy[locale];

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045]">
      <div className="grid gap-4 p-4 lg:grid-cols-[14rem_1fr]">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-[1.35rem] bg-taupe/20">
            {product.image ? (
              <ProductImage src={product.image} alt={product.name[locale]} className="h-full w-full" />
            ) : (
              <ProductPhotoPlaceholder compact label={c.photoReserved} />
            )}
            <div className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white backdrop-blur-xl">
              {labels[product.category][locale]}
            </div>
          </div>
          <label className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-ink">
            <Upload size={16} />
            {c.uploadImage}
            <input type="file" accept="image/*" onChange={handleUpload} className="sr-only" />
          </label>
          <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/42">
            {c.imageUrl}
            <span className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3">
              <ImageIcon size={16} className="text-taupe" />
              <input
                value={product.image}
                onChange={(event) => onUpdateProduct(product.id, { image: event.target.value })}
                className="h-11 min-w-0 flex-1 bg-transparent text-sm normal-case tracking-normal text-white outline-none"
              />
            </span>
          </label>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_10rem_10rem]">
            <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/42">
              {t.product}
              <input
                value={product.name[locale]}
                onChange={(event) =>
                  onUpdateProduct(product.id, {
                    name: { ...product.name, [locale]: event.target.value }
                  })
                }
                className="h-12 rounded-2xl border border-white/10 bg-black/20 px-4 text-base normal-case tracking-normal text-white outline-none focus:border-taupe/70"
              />
            </label>
            <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/42">
              {t.price}
              <input
                type="number"
                min="0"
                step="1"
                value={product.price}
                onChange={(event) =>
                  onUpdateProduct(product.id, { price: Number(event.target.value) })
                }
                className="h-12 rounded-2xl border border-white/10 bg-black/20 px-4 text-right text-base normal-case tracking-normal text-white outline-none focus:border-taupe/70"
              />
            </label>
            <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/42">
              {c.category}
              <select
                value={product.category}
                onChange={(event) =>
                  onUpdateProduct(product.id, { category: event.target.value as Category })
                }
                className="h-12 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm normal-case tracking-normal text-white outline-none focus:border-taupe/70"
              >
                {categoryOrder.map((item) => (
                  <option key={item} value={item} className="bg-ink text-white">
                    {labels[item][locale]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/42">
            {c.description}
            <textarea
              value={product.description[locale]}
              onChange={(event) =>
                onUpdateProduct(product.id, {
                  description: { ...product.description, [locale]: event.target.value }
                })
              }
              className="min-h-24 resize-y rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 normal-case tracking-normal text-white outline-none focus:border-taupe/70"
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <TogglePill
                checked={Boolean(product.signature)}
                label={c.signatureBadge}
                onChange={(checked) => onUpdateProduct(product.id, { signature: checked })}
              />
              <TogglePill
                checked={Boolean(product.featured)}
                label={c.featuredBadge}
                onChange={(checked) => onUpdateProduct(product.id, { featured: checked })}
              />
              <TogglePill
                checked={product.available !== false}
                label={product.available === false ? c.unavailable : c.available}
                onChange={(checked) => onUpdateProduct(product.id, { available: checked })}
                icon={product.available === false ? <EyeOff size={16} /> : <Eye size={16} />}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onUpdateProduct(product.id, product)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-white/72 transition hover:border-taupe/50 hover:bg-white/10 hover:text-white"
              >
                <Save size={16} />
                {t.save}
              </button>
              <button
                onClick={() => onDeleteProduct(product.id)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-red-400/20 px-4 text-sm text-red-100/72 transition hover:border-red-300/50 hover:bg-red-500/10 hover:text-red-50"
              >
                <Trash2 size={16} />
                {c.delete}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function TogglePill({
  checked,
  label,
  icon,
  onChange
}: {
  checked: boolean;
  label: string;
  icon?: ReactNode;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={[
        "inline-flex h-11 items-center gap-3 rounded-full border px-4 text-sm transition",
        checked
          ? "border-taupe/50 bg-taupe/18 text-white"
          : "border-white/10 bg-black/20 text-white/54"
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      {icon}
      <span>{label}</span>
    </label>
  );
}

function BottomNav({
  view,
  t,
  onChange
}: {
  view: View;
  t: Record<string, string>;
  onChange: (view: View) => void;
}) {
  const items = [
    { id: "home" as View, label: t.lounge, icon: Home },
    { id: "menu" as View, label: t.menu, icon: Search },
    { id: "favorites" as View, label: t.favorites, icon: Heart },
    { id: "admin" as View, label: t.admin, icon: Edit3 }
  ];

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-40 px-4 pb-[env(safe-area-inset-bottom)]">
      <div className="glass mx-auto grid h-20 max-w-md grid-cols-4 rounded-full p-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={[
                "relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-full text-[0.68rem] font-medium transition",
                active ? "text-ink" : "text-white/54 hover:text-white"
              ].join(" ")}
            >
              {active && (
                <motion.span
                  layoutId="active-nav"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icon className="relative" size={18} />
              <span className="relative max-w-full truncate px-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function ProductImage({
  src,
  alt,
  className
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <span className="relative block h-full w-full overflow-hidden">
      {!loaded && <span className="image-skeleton absolute inset-0" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={[
          "product-parallax-image object-cover",
          loaded ? "opacity-100" : "opacity-0",
          className || ""
        ].join(" ")}
      />
    </span>
  );
}
