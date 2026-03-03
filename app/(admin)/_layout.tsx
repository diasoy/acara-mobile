import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { useThemeMode } from "@/hooks/useThemeMode";

const ADMIN_TAB_ITEMS = [
  { name: "home", label: "Dashboard", icon: "grid-outline" },
  { name: "transaksi", label: "Transaksi", icon: "receipt-outline" },
  { name: "profile", label: "Profil", icon: "person-outline" },
] as const;

export default function AdminLayout() {
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

  if (user.role !== "admin") {
    return <Redirect href="/(member)/home" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: isDarkMode ? "#0f172a" : "#ffffff" },
        headerTintColor: isDarkMode ? "#f8fafc" : "#0f172a",
        headerTitleStyle: { fontFamily: "Manrope_600SemiBold" },
        tabBarStyle: {
          backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
          borderTopColor: isDarkMode ? "#1e293b" : "#e2e8f0",
        },
        tabBarActiveTintColor: isDarkMode ? "#10b981" : "#047857",
        tabBarInactiveTintColor: isDarkMode ? "#94a3b8" : "#64748b",
        tabBarLabelStyle: { fontFamily: "Manrope_500Medium" },
        tabBarIcon: ({ color, size }) => {
          const iconName = (ADMIN_TAB_ITEMS.find((item) => item.name === route.name)?.icon ??
            "help-circle-outline") as keyof typeof Ionicons.glyphMap;

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {ADMIN_TAB_ITEMS.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{
            title: item.label,
            headerShown: false,
          }}
        />
      ))}
    </Tabs>
  );
}
