"use client";

import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Globe2,
  ImageIcon,
  Instagram,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Star,
  Trash2,
  Upload
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { GoiaLogo } from "@/components/GoiaLogo";
import {
  Category,
  Locale,
  MenuCategory,
  Product,
  categoryLabels,
  categoryOrder,
  initialCategories,
  initialProducts,
  uiCopy
} from "@/lib/menu-data";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const adminCopy = {
  fr: {
    studio: "Studio GOIA",
    title: "Administration de la carte",
    subtitle: "Modifiez les produits, prix, descriptions, catégories, photos et disponibilités.",
    online: "Supabase prêt",
    local: "Mode local",
    search: "Rechercher un produit",
    add: "Ajouter",
    reset: "Réinitialiser",
    seed: "Synchroniser la carte complète",
    logout: "Déconnexion",
    categories: "Catégories",
    image: "Photo produit",
    imageUrl: "URL de l’image",
    upload: "Importer une photo",
    name: "Nom",
    description: "Description",
    category: "Catégorie",
    price: "Prix",
    available: "Disponible",
    unavailable: "Épuisé",
    featured: "Mis en avant",
    signature: "Signature",
    delete: "Supprimer",
    saved: "Enregistré",
    saving: "Enregistrement...",
    syncSuccess: "Synchronisation Supabase terminée.",
    syncError: "Synchronisation impossible.",
    supabaseMissing: "Supabase n’est pas configuré sur ce déploiement.",
    missingEnv: "Variables manquantes",
    ingredients: "Ingrédients",
    empty: "Aucun produit trouvé.",
    supabaseHint: "Connectez Supabase pour synchroniser les changements en ligne."
  },
  de: {
    studio: "GOIA Studio",
    title: "Kartenverwaltung",
    subtitle: "Produkte, Preise, Beschreibungen, Kategorien, Fotos und Verfügbarkeit bearbeiten.",
    online: "Supabase bereit",
    local: "Lokaler Modus",
    search: "Produkt suchen",
    add: "Hinzufügen",
    reset: "Zurücksetzen",
    seed: "Komplette Karte synchronisieren",
    logout: "Abmelden",
    categories: "Kategorien",
    image: "Produktfoto",
    imageUrl: "Bild-URL",
    upload: "Foto hochladen",
    name: "Name",
    description: "Beschreibung",
    category: "Kategorie",
    price: "Preis",
    available: "Verfügbar",
    unavailable: "Ausverkauft",
    featured: "Highlight",
    signature: "Signature",
    delete: "Löschen",
    saved: "Gespeichert",
    saving: "Speichert...",
    syncSuccess: "Supabase-Synchronisierung abgeschlossen.",
    syncError: "Synchronisierung nicht möglich.",
    supabaseMissing: "Supabase ist für dieses Deployment nicht konfiguriert.",
    missingEnv: "Fehlende Variablen",
    ingredients: "Zutaten",
    empty: "Kein Produkt gefunden.",
    supabaseHint: "Supabase verbinden, um Änderungen online zu synchronisieren."
  },
  en: {
    studio: "GOIA Studio",
    title: "Menu administration",
    subtitle: "Edit products, prices, descriptions, categories, photos and availability.",
    online: "Supabase ready",
    local: "Local mode",
    search: "Search product",
    add: "Add",
    reset: "Reset",
    seed: "Sync full menu",
    logout: "Log out",
    categories: "Categories",
    image: "Product photo",
    imageUrl: "Image URL",
    upload: "Upload photo",
    name: "Name",
    description: "Description",
    category: "Category",
    price: "Price",
    available: "Available",
    unavailable: "Sold out",
    featured: "Featured",
    signature: "Signature",
    delete: "Delete",
    saved: "Saved",
    saving: "Saving...",
    syncSuccess: "Supabase sync complete.",
    syncError: "Sync failed.",
    supabaseMissing: "Supabase is not configured for this deployment.",
    missingEnv: "Missing variables",
    ingredients: "Ingredients",
    empty: "No product found.",
    supabaseHint: "Connect Supabase to sync changes online."
  }
};

type SupabaseDiagnostic = {
  configured?: boolean;
  env?: Record<string, boolean>;
  missing?: string[];
};

type AdminApiResponse = SupabaseDiagnostic & {
  error?: string;
  publicUrl?: string;
};

function blankProduct(): Product {
  return {
    id: `goia-${Date.now()}`,
    category: "chichas",
    price: 0,
    image: "",
    signature: false,
    featured: false,
    available: true,
    name: { fr: "Nouveau produit", de: "Neues Produkt", en: "New product" },
    description: {
      fr: "Ajoutez une description élégante.",
      de: "Füge eine elegante Beschreibung hinzu.",
      en: "Add an elegant description."
    }
  };
}

function isCategory(value: string): value is Category {
  return categoryOrder.includes(value as Category);
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    category: isCategory(product.category) ? product.category : "chichas",
    image: product.image || "",
    available: product.available ?? true,
    featured: product.featured ?? false,
    signature: product.signature ?? false,
    name: { ...blankProduct().name, ...product.name },
    description: { ...blankProduct().description, ...product.description }
  };
}

function normalizeCategory(category: MenuCategory): MenuCategory {
  const id = isCategory(category.id) ? category.id : "chichas";
  return {
    id,
    position: category.position ?? categoryOrder.indexOf(id),
    labels: { ...categoryLabels[id], ...category.labels },
    available: category.available ?? true
  };
}

function categoryLabel(categoryId: Category, categories: MenuCategory[], locale: Locale) {
  return (
    categories.find((category) => category.id === categoryId)?.labels[locale] ||
    categoryLabels[categoryId][locale]
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("fr");
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>(initialCategories);
  const [status, setStatus] = useState<"saved" | "saving">("saved");
  const [syncMessage, setSyncMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [supabaseDiagnostic, setSupabaseDiagnostic] =
    useState<SupabaseDiagnostic | null>(null);
  const [onlineStorage, setOnlineStorage] = useState(false);
  const copy = adminCopy[locale];

  useEffect(() => {
    refreshAdminData();
  }, []);

  async function refreshAdminData() {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories")
    ]);
    const productsData = (await productsResponse.json()) as {
      configured?: boolean;
      products?: Product[];
      env?: Record<string, boolean>;
      missing?: string[];
    };
    const categoriesData = (await categoriesResponse.json()) as {
      configured?: boolean;
      categories?: MenuCategory[];
      env?: Record<string, boolean>;
      missing?: string[];
    };

    setOnlineStorage(Boolean(productsData.configured && categoriesData.configured));
    setSupabaseDiagnostic({
      configured: Boolean(productsData.configured && categoriesData.configured),
      env: { ...productsData.env, ...categoriesData.env },
      missing: [...(productsData.missing || []), ...(categoriesData.missing || [])].filter(
        (name, index, list) => list.indexOf(name) === index
      )
    });
    setProducts((productsData.products || []).map(normalizeProduct));
    setCategories((categoriesData.categories?.length ? categoriesData.categories : initialCategories)
      .map(normalizeCategory)
      .sort((a, b) => a.position - b.position));
  }

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return products;

    return products.filter((product) =>
      [
        product.name.fr,
        product.name.de,
        product.name.en,
        product.description.fr,
        product.description.de,
        product.description.en,
        categoryLabel(product.category, categories, locale)
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [locale, products, query]);

  async function persistProduct(product: Product) {
    if (!onlineStorage) return;
    setStatus("saving");
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    const data = (await response.json().catch(() => ({}))) as AdminApiResponse;
    setSupabaseDiagnostic({
      configured: data.configured,
      env: data.env,
      missing: data.missing
    });
    if (!response.ok || data.error) {
      setSyncMessage({
        type: "error",
        text: data.error || copy.syncError
      });
      setStatus("saved");
      return;
    }
    setSyncMessage({
      type: "success",
      text: copy.saved
    });
    setStatus("saved");
  }

  function persistProducts(nextProducts: Product[]) {
    setProducts(nextProducts);
  }

  async function updateProduct(id: string, patch: Partial<Product>) {
    const nextProducts = products.map((product) =>
      product.id === id ? normalizeProduct({ ...product, ...patch }) : product
    );
    persistProducts(nextProducts);

    const updatedProduct = nextProducts.find((product) => product.id === id);
    if (updatedProduct) await persistProduct(updatedProduct);
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

    if (onlineStorage) {
      setStatus("saving");
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = (await response.json().catch(() => ({}))) as AdminApiResponse;
      setSupabaseDiagnostic({
        configured: data.configured,
        env: data.env,
        missing: data.missing
      });
      if (!response.ok || data.error) {
        setSyncMessage({
          type: "error",
          text: data.error || copy.syncError
        });
        setStatus("saved");
        return;
      }
      setSyncMessage({
        type: "success",
        text: copy.saved
      });
      setStatus("saved");
    }
  }

  async function resetProducts() {
    const reset = initialProducts.map(normalizeProduct);
    persistProducts(reset);

    if (onlineStorage) {
      setStatus("saving");
      const responses = await Promise.all(
        reset.map((product) =>
          fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
          })
        )
      );
      const failedResponse = responses.find((response) => !response.ok);
      if (failedResponse) {
        const data = (await failedResponse.json().catch(() => ({}))) as AdminApiResponse;
        setSyncMessage({
          type: "error",
          text: data.error || copy.syncError
        });
        setStatus("saved");
        return;
      }
      setSyncMessage({
        type: "success",
        text: copy.saved
      });
      setStatus("saved");
    }
  }

  async function seedSupabaseMenu() {
    setStatus("saving");
    setSyncMessage(null);

    try {
      const response = await fetch("/api/admin/seed", { method: "POST" });
      const data = (await response.json().catch(() => ({}))) as {
        configured?: boolean;
        categories?: number;
        products?: number;
        error?: string;
        env?: Record<string, boolean>;
        missing?: string[];
      };
      setSupabaseDiagnostic({
        configured: Boolean(data.configured),
        env: data.env,
        missing: data.missing || []
      });

      if (!response.ok) {
        throw new Error(data.error || copy.syncError);
      }

      if (!data.configured) {
        const missing = data.missing?.length
          ? ` ${copy.missingEnv}: ${data.missing.join(", ")}`
          : "";
        throw new Error(`${copy.supabaseMissing}${missing}`);
      }

      await refreshAdminData();
      setOnlineStorage(true);
      setSyncMessage({
        type: "success",
        text: `${copy.syncSuccess} ${data.products || 0} produits, ${
          data.categories || 0
        } catégories.`
      });
    } catch (error) {
      setSyncMessage({
        type: "error",
        text: error instanceof Error ? error.message : copy.syncError
      });
    } finally {
      setStatus("saved");
    }
  }

  async function updateCategory(categoryId: Category, patch: Partial<MenuCategory>) {
    const nextCategories = categories
      .map((category) =>
        category.id === categoryId ? normalizeCategory({ ...category, ...patch }) : category
      )
      .sort((a, b) => a.position - b.position);
    setCategories(nextCategories);

    const updatedCategory = nextCategories.find((category) => category.id === categoryId);
    if (!updatedCategory || !onlineStorage) return;

    setStatus("saving");
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCategory)
    });
    const data = (await response.json().catch(() => ({}))) as AdminApiResponse;
    setSupabaseDiagnostic({
      configured: data.configured,
      env: data.env,
      missing: data.missing
    });
    if (!response.ok || data.error) {
      setSyncMessage({
        type: "error",
        text: data.error || copy.syncError
      });
      setStatus("saved");
      return;
    }
    setSyncMessage({
      type: "success",
      text: copy.saved
    });
    setStatus("saved");
  }

  async function uploadProductImage(product: Product, file: File) {
    if (!onlineStorage) return;

    setStatus("saving");
    const formData = new FormData();
    formData.append("productId", product.id);
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData
    });
    const data = (await response.json().catch(() => ({}))) as AdminApiResponse;
    setSupabaseDiagnostic({
      configured: data.configured,
      env: data.env,
      missing: data.missing
    });

    if (!response.ok || data.error) {
      setSyncMessage({
        type: "error",
        text: data.error || copy.syncError
      });
      setStatus("saved");
      return;
    }

    if (data.publicUrl) {
      await updateProduct(product.id, { image: data.publicUrl });
    }
    setStatus("saved");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-ink px-4 pb-10 pt-5 text-porcelain sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-5">
        <header className="glass flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] px-4 py-3 sm:rounded-full">
          <GoiaLogo compact mark />
          <div className="flex items-center gap-2">
            <LanguageSwitch locale={locale} setLocale={setLocale} />
            <button
              onClick={logout}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-white/72 transition hover:border-[#8A7665]/50 hover:bg-white/10 hover:text-white"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{copy.logout}</span>
            </button>
          </div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: luxuryEase }}
          className="glass grid gap-5 rounded-[2rem] p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#8A7665]">
                <Sparkles size={15} />
                {copy.studio}
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-white sm:text-5xl">
                {copy.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
                {copy.subtitle}
              </p>
            </div>
            <span className="rounded-full border border-[#8A7665]/40 px-4 py-2 text-sm text-white/72">
              {onlineStorage ? copy.online : copy.local}
            </span>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
            <label className="flex h-14 items-center gap-3 rounded-[1.45rem] border border-white/10 bg-black/24 px-4 focus-within:border-[#8A7665]/60">
              <Search size={18} className="text-[#8A7665]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.search}
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/36"
              />
            </label>
            <button
              onClick={resetProducts}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/10 px-5 text-sm text-white/72 transition hover:border-[#8A7665]/50 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw size={16} />
              {copy.reset}
            </button>
            <button
              onClick={seedSupabaseMenu}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-[#8A7665]/30 bg-[#8A7665]/12 px-5 text-sm text-white transition hover:border-[#8A7665]/60 hover:bg-[#8A7665]/20"
            >
              <RotateCcw size={16} />
              {copy.seed}
            </button>
            <button
              onClick={addProduct}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-porcelain"
            >
              <Plus size={16} />
              {copy.add}
            </button>
          </div>

          {!onlineStorage && (
            <p className="rounded-2xl border border-[#8A7665]/20 bg-[#8A7665]/10 px-4 py-3 text-sm text-white/62">
              {copy.supabaseHint}
              {supabaseDiagnostic?.missing?.length ? (
                <span className="mt-2 block text-white/80">
                  {copy.missingEnv}: {supabaseDiagnostic.missing.join(", ")}
                </span>
              ) : null}
            </p>
          )}

          {syncMessage && (
            <p
              className={[
                "rounded-2xl border px-4 py-3 text-sm",
                syncMessage.type === "success"
                  ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-50"
                  : "border-red-300/25 bg-red-500/10 text-red-50"
              ].join(" ")}
            >
              {syncMessage.text}
            </p>
          )}

          <p className="text-xs uppercase tracking-[0.22em] text-white/38">
            {status === "saving" ? copy.saving : copy.saved}
          </p>
        </motion.section>

        <AdminCategoryPanel
          categories={categories}
          locale={locale}
          title={copy.categories}
          onUpdateCategory={updateCategory}
        />

        <section className="grid gap-4">
          {filteredProducts.map((product) => (
            <AdminProductCard
              key={product.id}
              categories={categories}
              locale={locale}
              product={product}
              onDeleteProduct={deleteProduct}
              onImageUpload={uploadProductImage}
              onUpdateProduct={updateProduct}
            />
          ))}

          {!filteredProducts.length && (
            <div className="glass rounded-[2rem] p-8 text-center text-white/54">{copy.empty}</div>
          )}
        </section>
      </div>
    </main>
  );
}

function AdminProductCard({
  categories,
  locale,
  product,
  onDeleteProduct,
  onImageUpload,
  onUpdateProduct
}: {
  categories: MenuCategory[];
  locale: Locale;
  product: Product;
  onDeleteProduct: (id: string) => void;
  onImageUpload: (product: Product, file: File) => void;
  onUpdateProduct: (id: string, patch: Partial<Product>) => void;
}) {
  const copy = adminCopy[locale];

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onImageUpload(product, file);
    event.target.value = "";
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: luxuryEase }}
      className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_90px_rgba(0,0,0,0.32)]"
    >
      <div className="grid gap-4 p-4 lg:grid-cols-[15rem_1fr]">
        <div className="grid gap-3">
          <div className="relative aspect-square overflow-hidden rounded-[1.4rem] bg-black">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name[locale]}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <PhotoPlaceholder label={copy.image} />
            )}
            <span className="absolute left-3 top-3 rounded-full border border-[#8A7665]/35 bg-black/45 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-white backdrop-blur-xl">
              {categoryLabel(product.category, categories, locale)}
            </span>
          </div>

          <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-black">
            <Upload size={16} />
            {copy.upload}
            <input type="file" accept="image/*" onChange={handleUpload} className="sr-only" />
          </label>

          <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/42">
            {copy.imageUrl}
            <span className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3">
              <ImageIcon size={16} className="text-[#8A7665]" />
              <input
                value={product.image}
                onChange={(event) => onUpdateProduct(product.id, { image: event.target.value })}
                className="h-11 min-w-0 flex-1 bg-transparent text-sm normal-case tracking-normal text-white outline-none"
              />
            </span>
          </label>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_9rem_12rem]">
            <Field label={copy.name}>
              <input
                value={product.name[locale]}
                onChange={(event) =>
                  onUpdateProduct(product.id, {
                    name: { ...product.name, [locale]: event.target.value }
                  })
                }
                className="goia-admin-input"
              />
            </Field>
            <Field label={copy.price}>
              <input
                type="number"
                min="0"
                step="0.5"
                value={product.price}
                onChange={(event) =>
                  onUpdateProduct(product.id, { price: Number(event.target.value) })
                }
                className="goia-admin-input text-right"
              />
            </Field>
            <Field label={copy.category}>
              <select
                value={product.category}
                onChange={(event) =>
                  onUpdateProduct(product.id, { category: event.target.value as Category })
                }
                className="goia-admin-input"
              >
                {categoryOrder.map((category) => (
                  <option key={category} value={category} className="bg-ink text-white">
                    {categoryLabel(category, categories, locale)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={copy.description}>
            <textarea
              value={product.description[locale]}
              onChange={(event) =>
                onUpdateProduct(product.id, {
                  description: { ...product.description, [locale]: event.target.value }
                })
              }
              className="goia-admin-input min-h-28 resize-y py-3 leading-6"
            />
          </Field>

          <Field label={copy.ingredients}>
            <textarea
              value={product.ingredients?.[locale] || ""}
              onChange={(event) =>
                onUpdateProduct(product.id, {
                  ingredients: {
                    fr: product.ingredients?.fr || "",
                    de: product.ingredients?.de || "",
                    en: product.ingredients?.en || "",
                    [locale]: event.target.value
                  }
                })
              }
              className="goia-admin-input min-h-20 resize-y py-3 leading-6"
            />
          </Field>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <TogglePill
                checked={product.available !== false}
                label={product.available === false ? copy.unavailable : copy.available}
                icon={product.available === false ? <EyeOff size={16} /> : <Eye size={16} />}
                tone="availability"
                onChange={(checked) => onUpdateProduct(product.id, { available: checked })}
              />
              <TogglePill
                checked={Boolean(product.featured)}
                label={copy.featured}
                icon={<Star size={16} />}
                onChange={(checked) => onUpdateProduct(product.id, { featured: checked })}
              />
              <TogglePill
                checked={Boolean(product.signature)}
                label={copy.signature}
                icon={<Sparkles size={16} />}
                onChange={(checked) => onUpdateProduct(product.id, { signature: checked })}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onUpdateProduct(product.id, product)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-white/72 transition hover:border-[#8A7665]/50 hover:bg-white/10 hover:text-white"
              >
                <Save size={16} />
                {uiCopy[locale].save}
              </button>
              <button
                onClick={() => onDeleteProduct(product.id)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-red-400/20 px-4 text-sm text-red-100/72 transition hover:border-red-300/50 hover:bg-red-500/10 hover:text-red-50"
              >
                <Trash2 size={16} />
                {copy.delete}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function AdminCategoryPanel({
  categories,
  locale,
  title,
  onUpdateCategory
}: {
  categories: MenuCategory[];
  locale: Locale;
  title: string;
  onUpdateCategory: (categoryId: Category, patch: Partial<MenuCategory>) => void;
}) {
  return (
    <section className="glass grid gap-4 rounded-[2rem] p-5 sm:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#8A7665]">GOIA</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="grid gap-3 rounded-[1.4rem] border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/42">{category.id}</p>
              <input
                type="number"
                value={category.position}
                onChange={(event) =>
                  onUpdateCategory(category.id, { position: Number(event.target.value) })
                }
                className="h-10 w-20 rounded-full border border-white/10 bg-black/20 px-3 text-right text-sm text-white outline-none focus:border-[#8A7665]/70"
              />
            </div>
            <Field label={categoryLabels[category.id][locale]}>
              <input
                value={category.labels[locale]}
                onChange={(event) =>
                  onUpdateCategory(category.id, {
                    labels: { ...category.labels, [locale]: event.target.value }
                  })
                }
                className="goia-admin-input"
              />
            </Field>
            <TogglePill
              checked={category.available !== false}
              label={category.available === false ? "Hidden" : "Visible"}
              onChange={(checked) => onUpdateCategory(category.id, { available: checked })}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

function LanguageSwitch({
  locale,
  setLocale
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  const languages: Array<{ id: Locale; label: string }> = [
    { id: "fr", label: "FR" },
    { id: "de", label: "DE" },
    { id: "en", label: "EN" }
  ];

  return (
    <div className="flex h-11 items-center rounded-full border border-white/10 bg-black/20 px-1">
      <Globe2 className="ml-2 mr-1 hidden text-[#8A7665] sm:block" size={16} />
      {languages.map((language) => (
        <button
          key={language.id}
          onClick={() => setLocale(language.id)}
          className={[
            "h-8 rounded-full px-3 text-xs font-semibold transition",
            locale === language.id ? "bg-white text-black" : "text-white/54 hover:text-white"
          ].join(" ")}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/42">
      {label}
      {children}
    </label>
  );
}

function TogglePill({
  checked,
  label,
  icon,
  tone = "default",
  onChange
}: {
  checked: boolean;
  label: string;
  icon?: ReactNode;
  tone?: "default" | "availability";
  onChange: (checked: boolean) => void;
}) {
  const checkedClass =
    tone === "availability"
      ? "border-emerald-300/45 bg-emerald-400/14 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.12)]"
      : "border-[#8A7665]/50 bg-[#8A7665]/18 text-white";
  const uncheckedClass =
    tone === "availability"
      ? "border-red-300/28 bg-red-500/10 text-red-50/82 shadow-[0_0_24px_rgba(248,113,113,0.08)]"
      : "border-white/10 bg-black/20 text-white/54";

  return (
    <label
      className={[
        "inline-flex h-11 cursor-pointer items-center gap-3 rounded-full border px-4 text-sm transition",
        checked ? checkedClass : uncheckedClass
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      {tone === "availability" && (
        <span
          className={[
            "h-2.5 w-2.5 rounded-full shadow-[0_0_16px_currentColor]",
            checked ? "bg-emerald-300 text-emerald-300" : "bg-red-300 text-red-300"
          ].join(" ")}
        />
      )}
      {icon}
      <span>{label}</span>
    </label>
  );
}

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_50%_32%,rgba(138,118,101,0.24),rgba(0,0,0,0.88)_58%)]">
      <div className="grid place-items-center gap-3 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-[#8A7665]/35 bg-[#8A7665]/10 text-[#8A7665]">
          <ImageIcon size={22} />
        </span>
        <span className="px-4 text-xs uppercase tracking-[0.2em] text-white/42">{label}</span>
      </div>
    </div>
  );
}
