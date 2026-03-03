import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { useThemeMode } from "@/hooks/useThemeMode";

export default function MemberRootLayout() {
  const { isAuthHydrating, isAuthenticated, isLoadingMe, user } = useAuth();
  const { isDarkMode } = useThemeMode();

  if (isAuthHydrating || (isAuthenticated && isLoadingMe && !user)) {
    return (
      <View
        className={`flex-1 items-center justify-center ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}
      >
        <ActivityIndicator color="#10b981" />
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user.role !== "member") {
    return <Redirect href="/(admin)/(tabs)/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: isDarkMode ? "#0f172a" : "#ffffff" },
        headerTintColor: isDarkMode ? "#f8fafc" : "#0f172a",
        headerTitleStyle: { fontFamily: "Manrope_600SemiBold" },
        contentStyle: { backgroundColor: isDarkMode ? "#020617" : "#f1f5f9" },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="ticket/index"
        options={{
          title: "Tiket Saya",
          headerBackTitle: "Kembali",
        }}
      />
      <Stack.Screen
        name="history/index"
        options={{
          title: "Riwayat Booking",
          headerBackTitle: "Kembali",
        }}
      />
      <Stack.Screen
        name="wishlist/index"
        options={{
          title: "Wishlist",
          headerBackTitle: "Kembali",
        }}
      />
    </Stack>
  );
}
