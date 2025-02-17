import { api } from "./api";
import { Product } from "@/types/product.types";
import {
  ApiResponse,
  ProductsResponse,
  Statistics,
  UpdateStockPayload,
} from "@/types/responses.types";

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
      return {
        data: Array.isArray(response.data)
          ? response.data
          : response.data.products,
      };
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
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
      const response = await api.get<Product>(`/products`, {
        params: {id}
      });
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

  async updateStock(
      payload: {
        productId: string | number;
        stockId: number;
        quantity: number;
        warehousemanId: number;
      }
  ): Promise<ApiResponse<Product>> {
    try {
      const { productId, stockId, quantity, warehousemanId } = payload;

      // Step 1: Fetch the current product data
      const productResponse = await this.getProductById(productId.toString());
      if (productResponse.error || !productResponse.data || productResponse.data.length === 0) {
        throw new Error(productResponse.error || "Product not found");
      }

      const currentProduct = productResponse.data[0];
      console.log("currentProduct:", JSON.stringify(currentProduct, null, 2),);

      // Step 2: Update the stock quantity
      let updatedStocks = [...(currentProduct.stocks || [])];
      const stockIndex = updatedStocks.findIndex(
          (stock) => stock.id === stockId
      );
      console.log("updatedStocks:", JSON.stringify(updatedStocks, null, 2),);

      if (stockIndex === -1) {
        // If the stock doesn't exist and we're trying to remove stock, throw an error
        if (quantity < 0) {
          throw new Error("Cannot remove stock from a non-existent location");
        }

        // Fetch warehouse data using the warehousemanId
        const warehouseResponse = await api.get(
            `/warehousemans/${warehousemanId}`
        );
        if (!warehouseResponse.data) {
          throw new Error("Warehouse not found");
        }

        const warehouse = warehouseResponse.data;

        // Add a new stock entry
        updatedStocks.push({
          id: stockId,
          name: warehouse.name,
          quantity: quantity,
          localisation: {
            city: warehouse.city,
            latitude: warehouse.latitude || 0,
            longitude: warehouse.longitude || 0,
          },
        });
      } else {
        // Update existing stock
        const newQuantity = updatedStocks[stockIndex].quantity + quantity;
        if (newQuantity < 0) {
          throw new Error(
              `Insufficient stock. Current: ${updatedStocks[stockIndex].quantity}`
          );
        }

        updatedStocks[stockIndex] = {
          ...updatedStocks[stockIndex],
          quantity: newQuantity,
        };
      }

      console.log("updatedStocks: should  be updated", JSON.stringify(updatedStocks, null, 2),);
      // Step 3: Update the editedBy array
      const updatedEditedBy = [
        ...(currentProduct.editedBy || []),
        {
          warehousemanId: warehousemanId,
          at: new Date().toLocaleDateString(),
        },
      ];
      console.log("updatedEditedBy:", JSON.stringify(updatedEditedBy, null, 2),);

      // Step 4: Prepare the updated product object
      const updatedProduct = {
        ...currentProduct,
        stocks: updatedStocks,
        editedBy: updatedEditedBy,
      };
      console.log("updatedProduct:", JSON.stringify(updatedProduct, null, 2),);

      // Step 5: Send the entire updated product object to the server
      console.log("Sending updated product:", JSON.stringify(updatedProduct, null, 2));
      const response = await api.put<Product>(
          `/products/${productId}`,
          updatedProduct // ✅ Send the entire updated product object
      );
      // console.log("API Response:", JSON.stringify(response.data, null, 2));

      return { data: response.data };
    } catch (error) {
      console.error("Error updating stock:", error.response?.data || error.message);
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
   * Search products by name or barcode
   */
  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    try {
      const allProducts = await this.getAllProducts();
      if (allProducts.error) throw new Error(allProducts.error);

      const searchResults = allProducts.data.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.barcode.includes(query)
      );

      return { data: searchResults };
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
      const allProducts = await this.getAllProducts();
      if (allProducts.error) throw new Error(allProducts.error);

      const filteredProducts = allProducts.data.filter(
        (product) => product.type.toLowerCase() === type.toLowerCase()
      );

      return { data: filteredProducts };
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
      productId: string | number,
      stockId: number,
      quantity: number,
      warehousemanId: number
  ): Promise<ApiResponse<Product>> {
    if (quantity <= 0) {
      return {
        data: {} as Product,
        error: "Restock quantity must be greater than 0",
      };
    }

    return this.updateStock({
      productId,
      stockId,
      quantity: Math.abs(quantity),
      warehousemanId,
    });
  }

  /**
   * Handle product unload
   */
  async unloadProduct(
    productId: string | number,
    stockId: number,
    quantity: number,
    warehousemanId: number
  ): Promise<ApiResponse<Product>> {
    if (quantity <= 0) {
      return {
        data: {} as Product,
        error: "Unload quantity must be greater than 0",
      };
    }

    return this.updateStock({
      productId,
      stockId,
      quantity: -Math.abs(quantity),
      warehousemanId,
    });
  }

  /**
   * Add a new product
   */
  async addProduct(
    product: Omit<Product, "id">
  ): Promise<ApiResponse<Product>> {
    try {
      // Generate a random 4-character hex ID
      const id = Math.floor(Math.random() * 65536)
        .toString(16)
        .padStart(4, "0");

      const newProduct = {
        ...product,
        id,
        editedBy: [],
        stocks: [],
      };

      const response = await api.post<Product>("/products", newProduct);
      return { data: response.data };
    } catch (error) {
      console.error("Error adding product:", error);
      return {
        data: {} as Product,
        error: error instanceof Error ? error.message : "Failed to add product",
      };
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/products/${id}`);
      return { data: undefined };
    } catch (error) {
      console.error("Error deleting product:", error);
      return {
        data: undefined,
        error:
          error instanceof Error ? error.message : "Failed to delete product",
      };
    }
  }

  /**
   * Update a product
   */
  async updateProduct(
    id: string,
    product: Partial<Product>
  ): Promise<ApiResponse<Product>> {
    try {
      const currentProduct = await this.getProductById(id);
      if (currentProduct.error) throw new Error(currentProduct.error);

      const updatedProduct = {
        ...currentProduct.data,
        ...product,
      };

      const response = await api.put<Product>(
        `/products/${id}`,
        updatedProduct
      );
      return { data: response.data };
    } catch (error) {
      console.error("Error updating product:", error);
      return {
        data: {} as Product,
        error:
          error instanceof Error ? error.message : "Failed to update product",
      };
    }
  }
}

export const productService = ProductService.getInstance();
