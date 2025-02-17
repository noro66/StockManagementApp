export interface Localisation {
  city: string;
  latitude: number;
  longitude: number;
}

export interface Stock {
  id: number;
  name: string;
  quantity: number;
  localisation: Localisation;
}

export interface Editor {
  warehousemanId: number;
  at: string;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  type: string;
  price: number;
  solde?: number;
  supplier: string;
  image: string;
  stocks: Stock[];
  editedBy: EditHistory[];
}

export interface EditHistory {
  warehousemanId: number;
  at: string;
}

export interface ProductCardProps {
  product: Product;
  onRestock: (product: Product) => void;
  onUnload: (product: Product) => void;
}

export interface UpdateStockPayload {
  productId: string | number;
  stockId: number;
  quantity: number;
  warehousemanId: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ProductsResponse {
  products: Product[];
}

export interface Statistics {
  totalProducts: number;
  outOfStock: number;
  totalStockValue: number;
  mostAddedProducts: Product[];
  mostRemovedProducts: Product[];
}

export type SortKey = "name" | "price" | "quantity";
export type SortOrder = "asc" | "desc";
