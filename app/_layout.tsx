import { router, Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { AuthService } from "@/services/authService";


export default function RootLayout() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/(tabs)")) {
      checkAuthAndRedirect();
    }
  }, [pathname]);

  const checkAuthAndRedirect = async () => {
    const user = await AuthService.getCurrentUser();
    if (!user) {
      router.replace("/(auth)/authScreen");
    }
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen
        name="(tabs)"
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
