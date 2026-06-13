export const queryKeys = {
  products: ["products"] as const,
  product: (id: number) => ["products", id] as const,
  categories: ["categories"] as const,
  promotions: ["promotions"] as const,
  cart: ["cart"] as const,
};
