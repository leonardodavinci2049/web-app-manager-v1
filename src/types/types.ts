export interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  normalPrice: number;
  promotionalPrice?: number;
  stock: number;
  category: string;
  brand?: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  subgroups?: Subgroup[];
}

export interface Subgroup {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryHierarchy {
  id: string;
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest";

export type ViewMode = "grid" | "list";

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface FilterOptions {
  searchTerm: string;
  selectedCategory: string;
  selectedSubcategory?: string;
  selectedSubgroup?: string;
  onlyInStock: boolean;
  sortBy: SortOption;
}
