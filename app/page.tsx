"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  ChevronUp,
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

const reviewUrl = "https://www.google.com/search?q=GOIA+Huqqa+Lounge+reviews";
const instagramUrl = "https://www.instagram.com/goia.huqqa.lounge/";

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const storageVersion = "goia-luxury-v1";

const blankProduct = (): Product => ({
  id: `goia-${Date.now()}`,
  category: "hookah",
  price: 0,
  image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1400&q=85",
  signature: false,
  featured: false,
  available: true,
  name: { en: "New Product", fr: "Nouveau Produit", de: "Neues Produkt" },
  description: {
    en: "Add a short premium description.",
    fr: "Ajoutez une description courte et premium.",
    de: "Eine kurze Premium-Beschreibung."
  }
});

function normalizeProduct(product: Product, index = 0): Product {
  return {
    ...product,
    available: product.available ?? true,
    featured: product.featured ?? (Boolean(product.signature) || index < 4)
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
  const [locale, setLocale] = useState<Locale>("en");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
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
          <Landing key="landing" locale={locale} setLocale={setLocale} onEnter={enterLounge} />
        ) : (
          <motion.section
            key="app"
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
                subtitle={view === "admin" ? "GOIA Studio" : "GOIA Huqqa Lounge"}
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
                    allLabel={t.all}
                  />
                  <ProductGrid
                    products={filteredProducts}
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
  const t = uiCopy[locale];
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
        className="absolute inset-0 h-full w-full object-cover opacity-70 will-change-transform"
        autoPlay
        muted
        playsInline
        onTimeUpdate={(event) => restartWelcomeVideoAtFourteenSeconds(event.currentTarget)}
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1.015, opacity: 0.7 }}
        transition={{ scale: { duration: 8, ease: "easeOut" }, opacity: { duration: 1.8, ease: luxuryEase } }}
      >
        <source src="/goia-welcome.mp4" type="video/mp4" />
        <source src="/goia-welcome.webm" type="video/webm" />
        <source
          src="https://cdn.coverr.co/videos/coverr-pouring-a-drink-9747/1080p.mp4"
          type="video/mp4"
        />
      </motion.video>
      <div className="pointer-events-none absolute inset-0 bg-[rgba(0,0,0,0.45)]" />
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
        initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: luxuryEase }}
        className="relative z-10 flex flex-col items-center text-center will-change-transform"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.05, ease: luxuryEase }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.55, scale: 1 }}
            transition={{ duration: 1.2, ease: luxuryEase }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-taupe/20 blur-3xl sm:h-56 sm:w-96"
          />
          <GoiaLogo mark />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: luxuryEase }}
          className="mt-10 text-xl font-light text-white/82 sm:text-2xl"
        >
          {t.welcome}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: luxuryEase }}
          className="mt-9"
        >
          <motion.button
            animate={{ y: [0, -3, 0] }}
            transition={{ delay: 1.45, duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            onClick={onEnter}
            className="inline-flex h-14 items-center gap-3 rounded-full border border-white/40 bg-porcelain/95 px-7 text-sm font-semibold uppercase tracking-[0.18em] text-ink shadow-glow backdrop-blur-xl transition duration-300 hover:bg-white"
          >
            {t.enter}
            <ChevronUp size={18} />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
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
          <SocialButton href={reviewUrl} label="Google Reviews" icon={<Star size={17} />} />
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
          {products.length} selections across {categoriesInUse.size} curated categories.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-ink"
          >
            <Star size={16} />
            Google
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
  return (
    <div className="glass flex h-11 items-center rounded-full px-1">
      <Globe2 className="ml-3 mr-1 text-taupe" size={16} />
      {(["en", "fr", "de"] as Locale[]).map((item) => (
        <button
          key={item}
          onClick={() => setLocale(item)}
          className={[
            "h-8 rounded-full px-3 text-xs font-medium uppercase transition",
            locale === item ? "bg-white text-ink" : "text-white/62 hover:text-white"
          ].join(" ")}
        >
          {item}
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

function CategoryCards({
  category,
  locale,
  labels,
  products,
  allLabel,
  setCategory
}: {
  category: Category | "all";
  locale: Locale;
  labels: CategoryLabels;
  products: Product[];
  allLabel: string;
  setCategory: (category: Category | "all") => void;
}) {
  const categoryCards = categoryOrder.map((item) => {
    const categoryProducts = products.filter((product) => product.category === item);
    return {
      id: item,
      image: categoryProducts[0]?.image || products[0]?.image || "",
      count: categoryProducts.length,
      label: labels[item][locale]
    };
  });

  return (
    <section className="grid gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-taupe">GOIA Menu</p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Curated categories
          </h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm leading-6 text-white/46 sm:block">
          Explore the lounge selection through glass, smoke and signature GOIA moments.
        </p>
      </div>

      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4 xl:grid-cols-6">
        <CategoryCard
          active={category === "all"}
          count={products.length}
          image={products[0]?.image || ""}
          label={allLabel}
          eyebrow="Complete"
          onClick={() => setCategory("all")}
        />
        {categoryCards.map((item) => (
          <CategoryCard
            key={item.id}
            active={category === item.id}
            count={item.count}
            image={item.image}
            label={item.label}
            eyebrow="Category"
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
  eyebrow,
  image,
  label,
  onClick
}: {
  active: boolean;
  count: number;
  eyebrow: string;
  image: string;
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
        "luxury-surface group relative h-48 w-[78vw] shrink-0 snap-center overflow-hidden rounded-[2rem] border text-left shadow-glass transition sm:h-56 sm:w-auto",
        active
          ? "border-white/38 bg-white/[0.10]"
          : "border-white/10 bg-white/[0.045] hover:border-taupe/50"
      ].join(" ")}
    >
      {image && (
        <ProductImage
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full opacity-62 transition duration-700 group-hover:scale-105 group-hover:opacity-78"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/42 to-black/12" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(138,118,101,0.26),transparent_48%)]" />
      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-white/12 bg-black/24 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/58 backdrop-blur-xl">
            {eyebrow}
          </span>
          <span
            className={[
              "h-2.5 w-2.5 rounded-full transition",
              active ? "bg-white shadow-[0_0_24px_rgba(255,255,255,0.85)]" : "bg-taupe/70"
            ].join(" ")}
          />
        </div>
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-taupe">
            {count} selections
          </p>
          <h3 className="mt-2 text-2xl font-semibold leading-none text-white">{label}</h3>
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
  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-taupe">Featured</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Signature moments</h2>
        </div>
        <BadgeCheck className="text-taupe" size={24} />
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {products.map((product) => (
          <motion.article
            key={product.id}
            layoutId={`featured-${product.id}`}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpen(product)}
            className="relative h-[24rem] w-[82vw] max-w-[28rem] shrink-0 snap-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-glass sm:w-[26rem]"
          >
            <ProductImage src={product.image} alt={product.name[locale]} className="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/18 to-transparent" />
            <button
              onClick={(event) => {
                event.stopPropagation();
                onToggleFavorite(product.id);
              }}
              aria-label="Favorite"
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/38 text-white backdrop-blur-xl transition hover:bg-white hover:text-ink"
            >
              <Heart size={20} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-taupe">
                {labels[product.category][locale]}
              </p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <h3 className="text-3xl font-semibold leading-tight text-white">
                  {product.name[locale]}
                </h3>
                <p className="shrink-0 text-xl font-semibold text-white">
                  {currency.format(product.price)}
                </p>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/66">
                {product.description[locale]}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function ProductGrid({
  products,
  locale,
  labels,
  favorites,
  emptyText,
  onOpen,
  onToggleFavorite
}: {
  products: Product[];
  locale: Locale;
  labels: CategoryLabels;
  favorites: string[];
  emptyText: string;
  onOpen: (product: Product) => void;
  onToggleFavorite: (id: string) => void;
}) {
  if (!products.length) {
    return (
      <div className="glass flex min-h-72 items-center justify-center rounded-[2rem] text-white/58">
        {emptyText}
      </div>
    );
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-taupe">GOIA Selection</p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            The menu
          </h2>
        </div>
        <p className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/58 backdrop-blur-xl">
          {products.length} items
        </p>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.article
              layout
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.35, ease: luxuryEase }}
              onClick={() => onOpen(product)}
              className="luxury-surface group overflow-hidden rounded-[2.15rem] border border-white/10 bg-white/[0.055] shadow-glass backdrop-blur-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-taupe/20">
                <ProductImage
                  src={product.image}
                  alt={product.name[locale]}
                  className="h-full w-full transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(product.id);
                  }}
                  aria-label="Favorite"
                  className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/38 text-white backdrop-blur-xl transition hover:bg-white hover:text-ink"
                >
                  <Heart
                    size={19}
                    fill={favorites.includes(product.id) ? "currentColor" : "none"}
                  />
                </button>
                {(product.signature || product.featured) && (
                  <span className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink">
                    {product.signature ? "Signature" : "Featured"}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-taupe">
                      {labels[product.category][locale]}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{product.name[locale]}</h2>
                  </div>
                  <p className="shrink-0 text-lg font-semibold text-white">
                    {currency.format(product.price)}
                  </p>
                </div>
                <p className="mt-3 min-h-12 text-sm leading-6 text-white/60">
                  {product.description[locale]}
                </p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
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
              <ProductImage src={product.image} alt={product.name[locale]} className="h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-black/24" />
            </div>
            <div className="flex flex-col justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(138,118,101,0.16),transparent_22rem)] p-6 sm:p-10">
              <p className="text-xs uppercase tracking-[0.28em] text-taupe">
                {labels[product.category][locale]}
              </p>
              <h2 className="mt-4 text-5xl font-semibold leading-none text-white sm:text-7xl">
                {product.name[locale]}
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/66">{product.description[locale]}</p>
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <p className="text-3xl font-semibold text-white">{currency.format(product.price)}</p>
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
  return (
    <section className="glass grid gap-5 rounded-[2rem] p-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-taupe">
          {uiCopy[locale].instagram}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">GOIA after dark</h2>
        <p className="mt-2 text-sm leading-6 text-white/58">
          Follow the lounge for new flavors, evenings and table moments.
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

  return (
    <div className="grid gap-5">
      <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-taupe">GOIA Studio</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{t.editMenu}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/52">
            Edit categories, products, image uploads, pricing, featured placement and availability.
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
            Reset
          </button>
          <button
            onClick={onAddProduct}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink transition hover:bg-porcelain"
          >
            <Plus size={16} />
            Add
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
  return (
    <section className="glass rounded-[1.75rem] p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-taupe">Categories</p>
          <h3 className="mt-1 text-xl font-semibold text-white">Menu architecture</h3>
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

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045]">
      <div className="grid gap-4 p-4 lg:grid-cols-[14rem_1fr]">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-[1.35rem] bg-taupe/20">
            <ProductImage src={product.image} alt={product.name[locale]} className="h-full w-full" />
            <div className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white backdrop-blur-xl">
              {labels[product.category][locale]}
            </div>
          </div>
          <label className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-ink">
            <Upload size={16} />
            Upload image
            <input type="file" accept="image/*" onChange={handleUpload} className="sr-only" />
          </label>
          <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/42">
            Image URL
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
              Product
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
              Price
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
              Category
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
            Description
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
                label="Signature"
                onChange={(checked) => onUpdateProduct(product.id, { signature: checked })}
              />
              <TogglePill
                checked={Boolean(product.featured)}
                label="Featured"
                onChange={(checked) => onUpdateProduct(product.id, { featured: checked })}
              />
              <TogglePill
                checked={product.available !== false}
                label={product.available === false ? "Unavailable" : "Available"}
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
                Save
              </button>
              <button
                onClick={() => onDeleteProduct(product.id)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-red-400/20 px-4 text-sm text-red-100/72 transition hover:border-red-300/50 hover:bg-red-500/10 hover:text-red-50"
              >
                <Trash2 size={16} />
                Delete
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
  return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className || ""}`} />;
}
