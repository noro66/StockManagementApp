import { Product } from "./product.types";

export type RootStackParamList = {
  "(auth)": undefined;
  "(tabs)": undefined;
  "product/[id]": { product: Product };
  "stock/[id]": { productId: number; stockId: number };
};

export type TabParamList = {
  home: undefined;
  products: undefined;
  profile: undefined;
};

export type AuthStackParamList = {
  index: undefined;
  "sign-in": undefined;
  "forgot-key": undefined;
};
