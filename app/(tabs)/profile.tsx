import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { AuthService } from "../../services/authService";

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    await AuthService.logout();
    router.replace("/(auth)/authScreen");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile Screen</Text>
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: "#ff4444",
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
