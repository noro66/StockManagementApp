import { Product } from "../types/product.types";

export const getTotalQuantity = (product: Product): number => {
  return product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
};

export const getStockStatus = (
  quantity: number
): { status: string; color: string } => {
  if (quantity === 0) return { status: "Out of stock", color: "#FF4444" };
  if (quantity < 10) return { status: "Low stock", color: "#FFB302" };
  return { status: "In stock", color: "#4CAF50" };
};

export const sortProducts = (
  products: Product[],
  sortKey: SortKey,
  sortOrder: SortOrder
): Product[] => {
  return [...products].sort((a, b) => {
    let compareValue = 0;
    switch (sortKey) {
      case "name":
        compareValue = a.name.localeCompare(b.name);
        break;
      case "price":
        compareValue = a.solde - b.solde;
        break;
      case "quantity":
        compareValue = getTotalQuantity(a) - getTotalQuantity(b);
        break;
    }
    return sortOrder === "asc" ? compareValue : -compareValue;
  });
};
