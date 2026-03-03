import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, Text, View } from "react-native";

import { useThemeMode } from "@/hooks/useThemeMode";

const HISTORY_ITEMS = [
  {
    id: "ORD-9001",
    eventName: "Tech Career Expo",
    date: "20 Apr 2026",
    total: "Rp80.000",
    paymentStatus: "Paid",
  },
  {
    id: "ORD-9002",
    eventName: "Food Carnival",
    date: "27 Apr 2026",
    total: "Rp0",
    paymentStatus: "Free",
  },
  {
    id: "ORD-9003",
    eventName: "Business Meetup",
    date: "02 Mei 2026",
    total: "Rp150.000",
    paymentStatus: "Pending",
  },
];

export default function MemberHistoryScreen() {
  const { isDarkMode } = useThemeMode();

  return (
    <ScrollView
      className={`flex-1 ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}
      contentContainerClassName="px-5 py-6 pb-8"
    >
      <Text className={`font-manrope-bold text-3xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>
        Riwayat Booking
      </Text>
      <Text className={`mt-2 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
        Halaman dummy histori transaksi dan booking member.
      </Text>

      <View className="mt-5 gap-3">
        {HISTORY_ITEMS.map((item) => {
          const isPaid = item.paymentStatus === "Paid" || item.paymentStatus === "Free";

          return (
            <View
              key={item.id}
              className={`rounded-2xl border p-4 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className={`font-manrope-semibold text-lg ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {item.eventName}
                  </Text>
                  <Text className={`mt-1 font-manrope ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {item.id}
                  </Text>
                </View>
                <View
                  className={`rounded-full px-3 py-1 ${
                    isPaid ? "bg-emerald-500/15" : "bg-amber-500/20"
                  }`}
                >
                  <Text
                    className={`font-manrope-semibold text-xs ${
                      isPaid ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {item.paymentStatus}
                  </Text>
                </View>
              </View>

              <View className="mt-4 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={16} color={isDarkMode ? "#94a3b8" : "#475569"} />
                  <Text className={`ml-2 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {item.date}
                  </Text>
                </View>
                <Text className={`font-manrope-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {item.total}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
