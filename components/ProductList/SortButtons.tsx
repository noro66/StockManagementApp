import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SortKey, SortOrder } from "../../types/product.types";
import { styles } from "./styles";

interface SortButtonsProps {
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSort: (key: SortKey) => void;
}

export const SortButtons: React.FC<SortButtonsProps> = ({
  sortKey,
  sortOrder,
  onSort,
}) => {
  const renderSortButton = (key: SortKey, label: string) => (
    <TouchableOpacity
      style={[styles.sortButton, sortKey === key && styles.sortButtonActive]}
      onPress={() => onSort(key)}
    >
      <Text style={styles.sortButtonText}>{label}</Text>
      {sortKey === key && (
        <MaterialIcons
          name={sortOrder === "asc" ? "arrow-upward" : "arrow-downward"}
          size={16}
          color="#fff"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.sortButtons}>
      {renderSortButton("name", "Name")}
      {renderSortButton("price", "Price")}
      {renderSortButton("quantity", "Quantity")}
    </View>
  );
};
