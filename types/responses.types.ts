import { Product } from "./product.types";

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

export interface UpdateStockPayload {
  productId: number;
  stockId: number;
  quantity: number;
}
