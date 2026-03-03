import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

import { useThemeMode } from "@/hooks/useThemeMode";

const MEMBER_TAB_ITEMS = [
  { name: "home", label: "Beranda", icon: "home-outline" },
  { name: "event", label: "Event", icon: "calendar-outline" },
  { name: "profile", label: "Profil", icon: "person-outline" },
] as const;

export default function MemberTabsLayout() {
  const { isDarkMode } = useThemeMode();

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
          const iconName = (MEMBER_TAB_ITEMS.find((item) => item.name === route.name)?.icon ??
            "help-circle-outline") as keyof typeof Ionicons.glyphMap;

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {MEMBER_TAB_ITEMS.map((item) => (
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
