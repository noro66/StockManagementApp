import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface TabIconProps {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, label, focused }) => {
  return (
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
  );
};

const TabsLayout: React.FC = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="productList"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="list"
              color={color}
              label="Produits List"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="person"
              color={color}
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    height: 84,
    paddingBottom: 20,
    paddingTop: 10,
  },
  header: {
    backgroundColor: "#2563EB",
  },
});

export default TabsLayout;
