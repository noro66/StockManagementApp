import React, {useState, useMemo, useEffect} from "react";
import { View, FlatList, Alert } from "react-native";
import { SearchBar } from "@/components/ProductList/SearchBar";
import { SortButtons } from "@/components/ProductList/SortButtons";
import { ProductCard } from "@/components/ProductList/ProductCard";
import { RestockModal } from "@/components/ProductList/RestockModal";
import { Product, SortKey, SortOrder } from "@/types/product.types";
import { sortProducts } from "@/utils/productUtils";
import { styles } from "@/components/ProductList/styles";
import { useProducts } from "@/hooks/useProducts";
import {AuthService} from "@/services/authService";

const ProductList: React.FC = () => {
  const { products, loading, error, restock, unload, refreshProducts } =
    useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRestockModalVisible, setRestockModalVisible] = useState(false);
  const [Amount, setAmount] = useState("");
  const [mode, setMode] = useState<string>("restock");

  const filteredAndSortedProducts = () => {
    let filtered = products.filter((product) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        product.name?.toLowerCase().includes(searchLower) ||
        product.type?.toLowerCase().includes(searchLower) ||
        product.supplier?.toLowerCase().includes(searchLower) ||
        product.price?.toString().includes(searchLower)
      );
    });

    return sortProducts(filtered, sortKey, sortOrder);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const handleRestock = async () => {
    if (selectedProduct && Amount) {
      const user = await AuthService.getCurrentUser();
      if (!user) {
        Alert.alert("Error", "You must be logged in to restock products.");
        return;
      }

      const stockId = selectedProduct.stocks[0]?.id ?? 1999;

      const quantity = parseInt(Amount);
      if (isNaN(quantity)) {
        Alert.alert("Error", "Please enter a valid number.");
        return;
      }

      if (quantity <= 0) {
        Alert.alert("Error", "Restock quantity must be greater than 0.");
        return;
      }

      try {
        await restock(
            selectedProduct.id,
            stockId,
            quantity,
            user.id
        );
        setRestockModalVisible(false);
        setAmount("");
        refreshProducts();
      } catch (error) {
        // @ts-ignore
        Alert.alert("Error", error?.message || "Failed to restock product.");
      }
    }
  };

  const handleUnload = (product: Product) => {
    Alert.prompt("Unload Units", "Enter number of units to remove:", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async (amount) => {
          if (amount) {
            await unload(product.id, product.stocks.id, parseInt(amount));
            refreshProducts();
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <SortButtons
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </View>
      <FlatList
        data={filteredAndSortedProducts()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onRestock={() => {
              setMode("restock");
              setSelectedProduct(item);
              setRestockModalVisible(true);
            }}
            onUnload={() => {
              setMode("unload");
              setSelectedProduct(item);
              setRestockModalVisible(true);
            }}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={refreshProducts}
      />

      <RestockModal
        visible={isRestockModalVisible}
        amount={Amount}
        onChangeAmount={setAmount}
        onConfirm={()=> mode  === "restock" ? handleRestock() : handleUnload()}
        onCancel={() => {
          setRestockModalVisible(false);
          setAmount("");
        }}
        mode={mode}
      />
    </View>
  );
};

export default ProductList;
