import React from "react";
import { TextInput, View } from "react-native";
import { styles } from "./styles";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
}) => (
  <TextInput
    style={styles.searchInput}
    placeholder="Search products..."
    value={value}
    onChangeText={onChangeText}
  />
);
