import { useState, useEffect } from "react";
import { Product } from "../types/product.types";
import { productService } from "../services/productService";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts();
      if (response.error) {
        setError(response.error);
      } else {
        setProducts(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const restock = async (
    productId: number,
    stockId: number,
    quantity: number
  ) => {
    setLoading(true);
    try {
      const response = await productService.restockProduct(
        productId,
        stockId,
        quantity
      );
      if (response.error) {
        setError(response.error);
      } else {
        // Update the local products state
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId ? response.data : product
          )
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to restock product"
      );
    } finally {
      setLoading(false);
    }
  };

  const unload = async (
    productId: number,
    stockId: number,
    quantity: number
  ) => {
    setLoading(true);
    try {
      const response = await productService.unloadProduct(
        productId,
        stockId,
        quantity
      );
      if (response.error) {
        setError(response.error);
      } else {
        // Update the local products state
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId ? response.data : product
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unload product");
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    restock,
    unload,
    refreshProducts: fetchProducts,
  };
};
