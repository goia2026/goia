import type { MenuCategory, Product } from "@/lib/menu-data";

const emptyLocaleRecord = { fr: "", de: "", en: "" };

export function normalizeAdminProduct(product: Product): Product {
  return {
    ...product,
    price: Number.isFinite(Number(product.price)) ? Number(product.price) : 0,
    image: product.image || "",
    signature: product.signature ?? false,
    featured: product.featured ?? false,
    available: product.available ?? true,
    name: { ...emptyLocaleRecord, ...product.name },
    description: { ...emptyLocaleRecord, ...product.description },
    ingredients: product.ingredients
      ? { ...emptyLocaleRecord, ...product.ingredients }
      : undefined
  };
}

export function normalizeAdminCategory(category: MenuCategory): MenuCategory {
  return {
    ...category,
    position: Number.isFinite(Number(category.position)) ? Number(category.position) : 0,
    labels: { ...emptyLocaleRecord, ...category.labels },
    available: category.available ?? true
  };
}
