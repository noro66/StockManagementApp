import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image
} from "react-native";
import { productService } from "@/services/productService";
import { Product } from "../../types/product.types";
import { router } from "expo-router";
import ProductScanner from "@/components/ProductList/ProductScanner";
import {Ionicons} from "@expo/vector-icons";  // Ensure the correct import path

const { width } = Dimensions.get("window");
const DEFAULT_IMAGE = "https://via.placeholder.com/150";

const AddProductScreen = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [barcode, setBarcode] = useState("");
  const [price, setPrice] = useState("");
  const [solde, setSolde] = useState("");
  const [supplier, setSupplier] = useState("");
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleAddProduct = async () => {
    if (!name || !type || !barcode || !price || !supplier) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const newProduct = {
      name,
      type,
      barcode,
      price: parseFloat(price),
      solde: solde ? parseFloat(solde) : undefined,
      supplier,
      image: image || DEFAULT_IMAGE,
      editedBy: [],
      stocks: [],
    };

    try {
      setLoading(true);
      const response = await productService.addProduct(newProduct);

      if (response && !response.error) {
        Alert.alert("Success", "Product added successfully!");
        router.replace("/");
      } else {
        const errorMessage = response?.error || "Failed to add product. Please try again.";
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Add product error:", error);
      Alert.alert(
          "Error",
          "An unexpected error occurred. The product might have been created. Please check before trying again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = async (scanData: { type: string; data: string }) => {
    try {
      const response = await productService.getProductByBarcode(scanData.data);
      if (response.data?.length == 0) {
        console.log("barcode scanned should be printed");
        setBarcode(scanData.data);
        setShowScanner(false);
        Alert.alert("Success", "Barcode scanned successfully");
      } else if (response.data?.length >= 1) {
        Alert.alert(
            "Product Exists",
            `A product with barcode ${scanData.data} already exists in the database.`,
            [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error checking barcode:", error);
      Alert.alert("Error", "Failed to verify barcode. Please try again.");
    }
  };

  const renderInput = (placeholder, value, setter, props = {}) => (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{placeholder}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
              placeholder={`Enter ${placeholder.toLowerCase()}`}
              value={value}
              onChangeText={setter}
              style={styles.input}
              placeholderTextColor="#999"
              {...props}
          />
          {props.rightIcon && props.rightIcon} {/* Add this line */}
        </View>
      </View>
  );

  return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
          <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Add Product</Text>
              <Text style={styles.subtitle}>
                Fill in the product details below
              </Text>
            </View>

            <View style={styles.formContainer}>
              {renderInput("Barcode", barcode, setBarcode, {
                keyboardType: "numeric",
                rightIcon: (
                    <TouchableOpacity onPress={() => setShowScanner(true)} style={styles.iconButton}>
                      <Ionicons name="camera" size={24} color="#999" />
                    </TouchableOpacity>
                ),
              })}
              {/*<TouchableOpacity onPress={() => setShowScanner(true)} style={styles.scanButton}>*/}
              {/*  <Text style={styles.scanButtonText}>Scan Barcode</Text>*/}
              {/*</TouchableOpacity>*/}

              {renderInput("Product Name", name, setName)}
              {renderInput("Product Type", type, setType)}
              {renderInput("Price", price, setPrice, { keyboardType: "numeric" })}
              {renderInput("Discounted Price", solde, setSolde, {
                keyboardType: "numeric",
              })}
              {renderInput("Supplier", supplier, setSupplier)}
              {renderInput("Image URL", image, setImage)}

              {image && (
                  <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: image }}
                        style={styles.image}
                        onError={() => setImage(DEFAULT_IMAGE)}
                    />
                  </View>
              )}

              <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleAddProduct}
                  disabled={loading}
              >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.buttonText}>Add Product</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* ProductScanner Modal */}
        <ProductScanner
            showScanner={showScanner}
            setShowScanner={setShowScanner}
            onBarcodeScanned={handleBarcodeScanned}
        />
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  imageContainer: {
    marginVertical: 20,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F8F8F8",
  },
  image: {
    width: "100%",
    height: width * 0.5,
    resizeMode: "cover",
  },
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#99C4FF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  scanButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  iconButton: {
    padding: 10,
  },
  scanButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
});

export default AddProductScreen;
