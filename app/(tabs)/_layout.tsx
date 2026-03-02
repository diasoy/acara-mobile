import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";

export default function TabsLayout() {
  const { isAuthHydrating, isAuthenticated, isLoadingMe, user } = useAuth();
  const isAdmin = user?.role === "admin";

  if (isAuthHydrating || (isAuthenticated && isLoadingMe && !user)) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator color="#10b981" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#0f172a" },
        headerTintColor: "#f8fafc",
        headerTitleStyle: { fontFamily: "Manrope_600SemiBold" },
        tabBarStyle: { backgroundColor: "#0f172a", borderTopColor: "#1e293b" },
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarLabelStyle: { fontFamily: "Manrope_500Medium" },
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === "home"
              ? "home"
              : route.name === "transaksi"
                ? "swap-horizontal"
                : route.name === "profile"
                  ? "person"
                  : "calendar";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="transaksi" options={{ title: "Transaksi" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen
        name="event"
        options={{
          title: "Event",
          href: isAdmin ? "/(tabs)/event" : null,
        }}
      />
    </Tabs>
  );
}
