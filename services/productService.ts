import { api } from "./api";
import { Product } from "../types/product.types";
import {
  ApiResponse,
  ProductsResponse,
  Statistics,
  UpdateStockPayload,
} from "../types/responses.types";

class ProductService {
  private static instance: ProductService;

  private constructor() {}

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Fetch all products
   */
  async getAllProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const response = await api.get<ProductsResponse>("/products");
      return { data: response.data };
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        data: [],
        error:
          error instanceof Error ? error.message : "Failed to fetch products",
      };
    }
  }

  /**
   * Fetch a single product by ID
   */
  async getProductById(id: number): Promise<ApiResponse<Product>> {
    try {
      const response = await api.get<Product>(`/products/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return {
        data: {} as Product,
        error:
          error instanceof Error ? error.message : "Failed to fetch product",
      };
    }
  }

  /**
   * Update product stock quantity
   */
  async updateStock(
    payload: UpdateStockPayload
  ): Promise<ApiResponse<Product>> {
    try {
      const { productId, stockId, quantity } = payload;
      const product = await this.getProductById(productId);

      if (product.error) {
        throw new Error(product.error);
      }

      const updatedProduct = {
        ...product.data,
        stocks: product.data.stocks.map((stock) =>
          stock.id === stockId
            ? { ...stock, quantity: stock.quantity + quantity }
            : stock
        ),
      };

      const response = await api.put<Product>(
        `/products/${productId}`,
        updatedProduct
      );
      return { data: response.data };
    } catch (error) {
      console.error("Error updating stock:", error);
      return {
        data: {} as Product,
        error:
          error instanceof Error ? error.message : "Failed to update stock",
      };
    }
  }

  /**
   * Get product statistics
   */
  async getStatistics(): Promise<ApiResponse<Statistics>> {
    try {
      const response = await api.get<Statistics>("/statistics");
      return { data: response.data };
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return {
        data: {} as Statistics,
        error:
          error instanceof Error ? error.message : "Failed to fetch statistics",
      };
    }
  }

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    try {
      const response = await api.get<ProductsResponse>(`/products?q=${query}`);
      return { data: response.data.products };
    } catch (error) {
      console.error("Error searching products:", error);
      return {
        data: [],
        error:
          error instanceof Error ? error.message : "Failed to search products",
      };
    }
  }

  /**
   * Filter products by type
   */
  async filterByType(type: string): Promise<ApiResponse<Product[]>> {
    try {
      const response = await api.get<ProductsResponse>(
        `/products?type=${type}`
      );
      return { data: response.data.products };
    } catch (error) {
      console.error("Error filtering products:", error);
      return {
        data: [],
        error:
          error instanceof Error ? error.message : "Failed to filter products",
      };
    }
  }

  /**
   * Handle product restock
   */
  async restockProduct(
    productId: number,
    stockId: number,
    quantity: number
  ): Promise<ApiResponse<Product>> {
    return this.updateStock({ productId, stockId, quantity });
  }

  /**
   * Handle product unload
   */
  async unloadProduct(
    productId: number,
    stockId: number,
    quantity: number
  ): Promise<ApiResponse<Product>> {
    return this.updateStock({ productId, stockId, quantity: -quantity });
  }
}

export const productService = ProductService.getInstance();
