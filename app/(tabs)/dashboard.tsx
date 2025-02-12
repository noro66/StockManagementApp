import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Product } from "../../types/product";

export default function DashboardScreen() {
  const [stats, setStats] = useState({ totalProducts: 0, outOfStock: 0 });

  useEffect(() => {
    fetch("http://192.168.9.153:3000/products") // Replace with real backend
      .then((res) => res.json())
      .then((data: Product[]) => {
        setStats({
          totalProducts: data.length,
          outOfStock: data.filter((item) => item.quantity === 0).length,
        });
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <Text>Total Products: {stats.totalProducts}</Text>
      <Text>Out of Stock: {stats.outOfStock}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
