import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Warehouseman, LoginResponse } from "../types/auth.types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const AUTH_STORAGE_KEY = "@warehouse_auth_user";

export class AuthService {
  private static api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  static async login(secretKey: string): Promise<Warehouseman> {
    try {
      const response = await this.api.get("/warehousemans", {
        params: { secretKey },
      });

      if (response.data.error || !response.data) {
        throw new Error(response.data.error || "Invalid credentials");
      }
      const warehouseman: Warehouseman = response.data;
      await this.saveUserToStorage(warehouseman);
      return warehouseman;
    } catch (error) {
      throw new Error("Authentication failed");
    }
  }

  static async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed");
    }
  }

  static async getCurrentUser(): Promise<Warehouseman | null> {
    try {
      const userJson = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  private static async saveUserToStorage(user: Warehouseman): Promise<void> {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  static getAuthorizationHeader(): string | null {
    const user = this.getCurrentUser();
    return user ? `Bearer ${user.secretKey}` : null;
  }
}
