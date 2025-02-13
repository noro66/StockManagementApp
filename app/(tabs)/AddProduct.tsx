import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { productService } from "../../services/productService";
import { Product } from "../../types/product.types";

const AddProductScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [barcode, setBarcode] = useState();
  const [price, setPrice] = useState();
  const [solde, setSolde] = useState();
  const [supplier, setSupplier] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async () => {
    if (!name || !type || !barcode || !price || !supplier) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const newProduct: Partial<Product> = {
      name,
      type,
      barcode,
      price: parseFloat(price),
      solde: solde ? parseFloat(solde) : undefined,
      supplier,
      image: image || "https://via.placeholder.com/150",
      stocks: [],
      editedBy: [],
    };

    setLoading(true);
    const response = await productService.addProduct(newProduct);

    if (response.error) {
      Alert.alert("Error", response.error);
    } else {
      Alert.alert("Success", "Product added successfully!");
      navigation.goBack();
    }
    setLoading(false);
  };

  return (
    <ScrollView style={{ padding: 15 }}>
      <View
        style={{
          flex: 1,
          marginTop: "100",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Add Product
        </Text>
        <TextInput
          placeholder="Barcode"
          value={barcode}
          onChangeText={setBarcode}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Product Type"
          value={type}
          onChangeText={setType}
          style={styles.input}
        />

        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Discounted Price (Solde)"
          value={solde}
          onChangeText={setSolde}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Supplier"
          value={supplier}
          onChangeText={setSupplier}
          style={styles.input}
        />
        <TextInput
          placeholder="Image URL"
          value={image}
          onChangeText={setImage}
          style={styles.input}
        />

        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: 150, marginBottom: 10 }}
          />
        ) : null}

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <Button title="Add Product" onPress={handleAddProduct} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = {
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
};

export default AddProductScreen;
