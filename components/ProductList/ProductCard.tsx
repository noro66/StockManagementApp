import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageURISource,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Product, ProductCardProps } from "../../types/product.types";
import { getTotalQuantity, getStockStatus } from "../../utils/productUtils";
import { styles } from "./styles";

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onRestock,
  onUnload,
}) => {
  const quantity = getTotalQuantity(product);
  const { status, color } = getStockStatus(quantity);
  const lastEditor = product.editedBy?.[product.editedBy?.length - 1] ?? "";

  // Handle image loading errors
  const handleImageError = () => {
    console.warn("Failed to load product image");
  };

  return (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          onError={handleImageError}
          accessibilityLabel={`Image of ${product.name}`}
        />
        {status !== "In stock" && (
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{status}</Text>
          </View>
        )}
      </View>

      <View style={styles.productContent}>
        <View style={styles.productHeader}>
          <Text style={styles.productName} accessibilityRole="header">
            {product.name}
          </Text>
          <Text style={styles.productType}>{product.type}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.salePrice}>{product.solde} MAD</Text>
          {product.price !== product.solde && (
            <Text style={styles.regularPrice}>{product.price} MAD</Text>
          )}
        </View>

        <View style={styles.stockInfo}>
          <Text style={[styles.stockStatus, { color }]}>{status}</Text>
          <Text style={styles.quantity}>Quantity: {quantity}</Text>
        </View>

        <Text style={styles.editedBy}>
          Last edited by: ID-{lastEditor?.warehousemanId} at {lastEditor?.at}
        </Text>

        <View style={styles.divider} />

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.restockButton]}
            onPress={() => onRestock(product)}
            accessibilityRole="button"
            accessibilityLabel="Restock product"
          >
            <Text style={styles.buttonText}>Restock</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.unloadButton, { opacity: quantity <= 0 ? 0.5 : 1 }]}
            onPress={() => onUnload(product)}
            accessibilityRole="button"
            accessibilityLabel="Unload product"
            disabled={quantity <= 0}

          >
            <Text style={styles.buttonText}>Unload</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
