import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/useAuth";
import { useThemeMode } from "@/hooks/useThemeMode";

const summaryCards = [
  {
    id: "bookings",
    title: "Total Bookings",
    value: "1,245",
    growth: "+12%",
    icon: "ticket-outline" as const,
    accentColor: "#3b82f6",
  },
  {
    id: "active-events",
    title: "Active Events",
    value: "34",
    growth: "+5%",
    icon: "checkbox-outline" as const,
    accentColor: "#8b5cf6",
  },
];

const modules = [
  {
    id: "event-management",
    title: "Event Management",
    subtitle: "Create & Edit",
    icon: "calendar-outline" as const,
    href: "/(admin)/event" as const,
  },
  {
    id: "category-list",
    title: "Category List",
    subtitle: "Tags & Types",
    icon: "apps-outline" as const,
    href: "/(admin)/category" as const,
  },
  {
    id: "banner-settings",
    title: "Banner Settings",
    subtitle: "App Sliders",
    icon: "images-outline" as const,
    href: "/(admin)/banner" as const,
  },
  {
    id: "transaction-reports",
    title: "Transaction Reports",
    subtitle: "Financials",
    icon: "receipt-outline" as const,
    href: "/(admin)/transaction" as const,
  },
] as const;

const recentBookings = [
  {
    id: "booking-1",
    title: "Summer Music Fest",
    subtitle: "by John Doe - 2m ago",
    status: "Paid",
    statusTone: "paid" as const,
    icon: "musical-notes-outline" as const,
  },
  {
    id: "booking-2",
    title: "Tech Conference 2024",
    subtitle: "by Sarah Smith - 15m ago",
    status: "Pending",
    statusTone: "pending" as const,
    icon: "laptop-outline" as const,
  },
];

export default function AdminHomeScreen() {
  const { user } = useAuth();
  const { isDarkMode } = useThemeMode();

  return (
    <SafeAreaView
      edges={["top"]}
      className={`flex-1 ${isDarkMode ? "bg-[#09071d]" : "bg-slate-100"}`}
    >
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        <View
          className={`border-b px-5 pb-5 pt-3 ${isDarkMode ? "border-[#1e1a48]" : "border-slate-200"}`}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="relative">
                <View
                  className={`h-11 w-11 items-center justify-center rounded-full border ${isDarkMode ? "border-[#3a2d7f] bg-[#1a1440]" : "border-slate-300 bg-white"}`}
                >
                  <Ionicons
                    name="person"
                    size={20}
                    color={isDarkMode ? "#d9d5ff" : "#334155"}
                  />
                </View>
                <View
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border bg-emerald-400 ${isDarkMode ? "border-[#09071d]" : "border-slate-100"}`}
                />
              </View>

              <View className="ml-3">
                <Text
                  className={`font-manrope text-sm ${isDarkMode ? "text-[#9f9ac8]" : "text-slate-500"}`}
                >
                  Admin panel
                </Text>
                <Text
                  className={`font-manrope-bold text-xl leading-6 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                >
                  {user?.fullName ?? "Admin User"}
                </Text>
              </View>
            </View>

            <View
              className={`relative h-10 w-10 items-center justify-center rounded-xl ${isDarkMode ? "bg-[#171237]" : "bg-white"}`}
            >
              <Ionicons
                name="notifications"
                size={18}
                color={isDarkMode ? "#e6e3ff" : "#334155"}
              />
              <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
            </View>
          </View>
        </View>

        <View className="px-4 pt-5">
          <View className="flex-row gap-3">
            {summaryCards.map((card) => (
              <View
                key={card.id}
                className={`flex-1 rounded-2xl p-4 ${isDarkMode ? "bg-[#18153b]" : "bg-white"}`}
              >
                <View className="flex-row items-center justify-between">
                  <View
                    className={`h-8 w-8 items-center justify-center rounded-lg ${isDarkMode ? "bg-[#252057]" : "bg-slate-100"}`}
                  >
                    <Ionicons
                      name={card.icon}
                      size={16}
                      color={card.accentColor}
                    />
                  </View>
                  <View className="rounded-full bg-emerald-500/15 px-2 py-1">
                    <Text className="font-manrope-semibold text-xs text-emerald-400">
                      {card.growth}
                    </Text>
                  </View>
                </View>
                <Text
                  className={`mt-4 font-manrope-medium text-sm ${isDarkMode ? "text-[#8e89b8]" : "text-slate-600"}`}
                >
                  {card.title}
                </Text>
                <Text
                  className={`mt-1 font-manrope-bold text-4xl leading-[40px] ${isDarkMode ? "text-white" : "text-slate-900"}`}
                >
                  {card.value}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-7 flex-row items-center justify-between">
            <Text
              className={`font-manrope-bold text-3xl ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              Management Modules
            </Text>
          </View>

          <View className="mt-3 flex-row flex-wrap justify-between">
            {modules.map((module) => (
              <Link key={module.id} href={module.href as any} asChild>
                <Pressable
                  className={`mb-3 w-[48.5%] rounded-2xl border p-4 active:opacity-85 ${isDarkMode ? "border-[#2c2865] bg-[#18153b]" : "border-slate-200 bg-white"}`}
                >
                  <View
                    className={`h-9 w-9 items-center justify-center rounded-lg ${isDarkMode ? "bg-[#252057]" : "bg-slate-100"}`}
                  >
                    <Ionicons
                      name={module.icon}
                      size={17}
                      color={isDarkMode ? "#ffffff" : "#334155"}
                    />
                  </View>
                  <Text
                    className={`mt-4 font-manrope-bold text-2xl leading-7 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                  >
                    {module.title}
                  </Text>
                  <View className="mt-2 flex-row items-center justify-between">
                    <Text
                      className={`font-manrope-medium text-sm ${isDarkMode ? "text-[#8e89b8]" : "text-slate-600"}`}
                    >
                      {module.subtitle}
                    </Text>
                    <Ionicons
                      name="arrow-forward-circle-outline"
                      size={18}
                      color={isDarkMode ? "#a7f3d0" : "#059669"}
                    />
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>

          <Text
            className={`mt-2 font-manrope-bold text-3xl ${isDarkMode ? "text-white" : "text-slate-900"}`}
          >
            Recent Bookings
          </Text>

          <View className="mt-3 gap-3">
            {recentBookings.map((booking) => {
              const isPaid = booking.statusTone === "paid";

              return (
                <View
                  key={booking.id}
                  className={`flex-row items-center justify-between rounded-2xl px-3 py-3 ${isDarkMode ? "bg-[#18153b]" : "bg-white"}`}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`h-11 w-11 items-center justify-center rounded-xl ${isDarkMode ? "bg-[#2b2659]" : "bg-slate-100"}`}
                    >
                      <Ionicons
                        name={booking.icon}
                        size={20}
                        color={isDarkMode ? "#f8fafc" : "#0f172a"}
                      />
                    </View>
                    <View className="ml-3">
                      <Text
                        className={`font-manrope-semibold text-base ${isDarkMode ? "text-white" : "text-slate-900"}`}
                      >
                        {booking.title}
                      </Text>
                      <Text
                        className={`font-manrope text-sm ${isDarkMode ? "text-[#8e89b8]" : "text-slate-600"}`}
                      >
                        {booking.subtitle}
                      </Text>
                    </View>
                  </View>

                  <View
                    className={`rounded-full px-3 py-1 ${
                      isPaid ? "bg-emerald-500/15" : "bg-amber-500/20"
                    }`}
                  >
                    <Text
                      className={`font-manrope-semibold text-sm ${
                        isPaid ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {booking.status}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
