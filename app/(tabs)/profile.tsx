import { AuthService } from "@/services/authService";
import { Warehouseman } from "@/types/auth.types";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const ProfileScreen = () => {
  const [user, setUser] = useState<Warehouseman | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await AuthService.getCurrentUser();
      console.log("Fetched user:", response);
      if (!response) {
        setError("User data not found.");
        Alert.alert("Error", "User data not found.");
      } else {
        setUser(response);
      }
    } catch (error) {
      setError("Failed to fetch user profile. Please try again later.");
      Alert.alert(
        "Error",
        "Failed to fetch user profile. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      const currentUser = await AuthService.getCurrentUser();
      console.log("Current user after logout:", currentUser);
      setUser(null);
      router.replace("/")
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: "https://via.placeholder.com/120" }}
          style={styles.profilePic}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>ID: {user?.id}</Text>
          <Text style={styles.info}>Date of Birth: {user?.dob}</Text>
          <Text style={styles.info}>City: {user?.city}</Text>
          <Text style={styles.info}>Secret Key: {user?.secretKey}</Text>
          <Text style={styles.info}>Warehouse ID: {user?.warehouseId}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#E5E5E5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    elevation: 10, // For Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: "center",
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#007AFF",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  infoContainer: {
    width: "100%",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 20,
  },
  logoutButton: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: "#FF3B30",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
