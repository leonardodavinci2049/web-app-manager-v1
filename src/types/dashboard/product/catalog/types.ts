export interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  normalPrice: number;
  promotionalPrice?: number;
  stock: number;
  category: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest";

export type ViewMode = "grid" | "list";

export interface FilterOptions {
  searchTerm: string;
  selectedCategory: string;
  onlyInStock: boolean;
  sortBy: SortOption;
}
