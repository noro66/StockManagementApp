import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AuthScreen from "./(auth)/authScreen";
import ProductList from "./(tabs)/productList";
import { AuthService } from "../services/authService";
import { Warehouseman } from "../types/auth.types";
import { Redirect } from "expo-router";

export default function Index() {
  const [user, setUser] = useState<Warehouseman | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const authenticatedUser = await AuthService.getCurrentUser();
      setUser(authenticatedUser);
    } catch (error) {
      console.error("Authentication check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={setUser} />;
  }

  return <Redirect href="/(tabs)/productList" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
