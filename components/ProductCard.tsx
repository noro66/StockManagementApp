interface ProductCardProps {
  product: Product;
}

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Product } from "../types/product.types";

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const totalStock: number = product.stocks.reduce(
    (sum, stock) => sum + stock.quantity,
    0
  );
  const discount: number = Number(
    (((product.price - product.solde) / product.price) * 100).toFixed(0)
  );

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="cover"
      />

      {discount > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{discount}%</Text>
        </View>
      )}

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.type}>{product.type}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{product.solde} MAD</Text>
          {discount > 0 && (
            <Text style={styles.originalPrice}>{product.price} MAD</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="inventory" size={20} color="#666" />
          <Text style={styles.infoText}>Total Stock: {totalStock}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="business" size={20} color="#666" />
          <Text style={styles.infoText}>Supplier: {product.supplier}</Text>
        </View>

        <View style={styles.stockList}>
          {product.stocks.map((stock) => (
            <View key={stock.id} style={styles.stockItem}>
              <Text style={styles.stockLocation}>
                {stock.name} ({stock.localisation.city})
              </Text>
              <Text style={styles.stockQuantity}>{stock.quantity} units</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF4B4B",
    padding: 6,
    borderRadius: 4,
  },
  discountText: {
    color: "white",
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  type: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  stockList: {
    marginTop: 12,
  },
  stockItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  stockLocation: {
    fontSize: 14,
    color: "#333",
  },
  stockQuantity: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
});

export default ProductCard;
