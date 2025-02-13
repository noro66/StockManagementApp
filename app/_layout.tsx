import { Stack } from "expo-router";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";

export default function RootLayout() {
  return (

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    // </ThemeProvider>
  );
}
