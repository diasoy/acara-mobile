import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/useAuth";

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
    highlighted: true,
  },
  {
    id: "category-list",
    title: "Category      List",
    subtitle: "Tags & Types",
    icon: "apps-outline" as const,
    highlighted: false,
  },
  {
    id: "banner-settings",
    title: "Banner Settings",
    subtitle: "App Sliders",
    icon: "images-outline" as const,
    highlighted: false,
  },
  {
    id: "transaction-reports",
    title: "Transaction Reports",
    subtitle: "Financials",
    icon: "receipt-outline" as const,
    highlighted: false,
  },
];

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

export default function HomeTabScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#09071d]">
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        <View className="border-b border-[#1e1a48] px-5 pb-5 pt-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="relative">
                <View className="h-11 w-11 items-center justify-center rounded-full border border-[#3a2d7f] bg-[#1a1440]">
                  <Ionicons name="person" size={20} color="#d9d5ff" />
                </View>
                <View className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border border-[#09071d] bg-emerald-400" />
              </View>

              <View className="ml-3">
                <Text className="font-manrope text-sm text-[#9f9ac8]">
                  Welcome back,
                </Text>
                <Text className="font-manrope-bold text-xl leading-6 text-white">
                  {user?.fullName ?? "Admin User"}
                </Text>
              </View>
            </View>

            <View className="relative h-10 w-10 items-center justify-center rounded-xl bg-[#171237]">
              <Ionicons name="notifications" size={18} color="#e6e3ff" />
              <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
            </View>
          </View>
        </View>

        <View className="px-4 pt-5">
          <View className="flex-row gap-3">
            {summaryCards.map((card) => (
              <View
                key={card.id}
                className="flex-1 rounded-2xl bg-[#18153b] p-4"
              >
                <View className="flex-row items-center justify-between">
                  <View className="h-8 w-8 items-center justify-center rounded-lg bg-[#252057]">
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
                <Text className="mt-4 font-manrope-medium text-sm text-[#8e89b8]">
                  {card.title}
                </Text>
                <Text className="mt-1 font-manrope-bold text-4xl leading-[40px] text-white">
                  {card.value}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-7 flex-row items-center justify-between">
            <Text className="font-manrope-bold text-3xl text-white">
              Management Modules
            </Text>
            <Text className="font-manrope-semibold text-sm text-[#6653ff]">
              View All
            </Text>
          </View>

          <View className="mt-3 flex-row flex-wrap justify-between">
            {modules.map((module) => (
              <View
                key={module.id}
                className="mb-3 w-[48.5%] rounded-2xl p-4 bg-[#18153b]"
              >
                <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#252057]">
                  <Ionicons name={module.icon} size={17} color="#FFFFFF" />
                </View>
                <Text className="mt-4 font-manrope-bold text-2xl leading-7 text-white">
                  {module.title}
                </Text>
                <Text className="mt-1 font-manrope-medium text-sm text-[#8e89b8]">
                  {module.subtitle}
                </Text>
              </View>
            ))}
          </View>

          <Text className="mt-2 font-manrope-bold text-3xl text-white">
            Recent Bookings
          </Text>

          <View className="mt-3 gap-3">
            {recentBookings.map((booking) => {
              const isPaid = booking.statusTone === "paid";

              return (
                <View
                  key={booking.id}
                  className="flex-row items-center justify-between rounded-2xl bg-[#18153b] px-3 py-3"
                >
                  <View className="flex-row items-center">
                    <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#2b2659]">
                      <Ionicons name={booking.icon} size={20} color="#f8fafc" />
                    </View>
                    <View className="ml-3">
                      <Text className="font-manrope-semibold text-base text-white">
                        {booking.title}
                      </Text>
                      <Text className="font-manrope text-sm text-[#8e89b8]">
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
