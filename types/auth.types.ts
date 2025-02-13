import { ApiResponse } from "./responses.types";

export interface Warehouseman {
  id: number;
  name: string;
  dob: string;
  city: string;
  secretKey: string;
  warehouseId: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  warehouseman: Warehouseman | null;
  loading: boolean;
  error: string | null;
}

export interface LoginResponse
  extends ApiResponse<{ warehouseman: Warehouseman }> {}
