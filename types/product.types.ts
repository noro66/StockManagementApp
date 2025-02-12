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
  id: number;
  name: string;
  type: string;
  price: number;
  image: string;
  solde: number;
  supplier: string;
  stocks: Stock[];
  editedBy: Editor[];
}

export interface ProductCardProps {
  product: Product;
  onRestock: (product: Product) => void;
  onUnload: (product: Product) => void;
}

export type SortKey = "name" | "price" | "quantity";
export type SortOrder = "asc" | "desc";
