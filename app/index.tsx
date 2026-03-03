import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { useThemeMode } from "@/hooks/useThemeMode";

export default function Index() {
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

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user?.role === "admin") {
    return <Redirect href="/(admin)/(tabs)/home" />;
  }

  if (user?.role === "member") {
    return <Redirect href="/(member)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
