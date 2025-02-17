import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AuthScreen from "./(auth)/authScreen";
import { AuthService } from "../services/authService";
import { Warehouseman } from "../types/auth.types";
import { useRouter } from "expo-router"; // Use useRouter for navigation

export default function Index() {
  const [user, setUser] = useState<Warehouseman | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Add this to handle navigation

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const authenticatedUser = await AuthService.getCurrentUser();
      setUser(authenticatedUser ?? null);
    } catch (error) {
      console.error("Authentication check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (user: Warehouseman) => {
    setUser(user);
  };

  useEffect(() => {
    if (user) {
      router.push("/(tabs)/productList"); // Redirect to productList after login
    }
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
