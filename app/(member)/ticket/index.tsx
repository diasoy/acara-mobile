import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, Text, View } from "react-native";

import { useThemeMode } from "@/hooks/useThemeMode";

const TICKETS = [
  {
    id: "TKT-101",
    eventName: "Frontend Conference 2026",
    schedule: "10 Mei 2026 - 09:00",
    seat: "REG-A12",
    status: "Active",
  },
  {
    id: "TKT-102",
    eventName: "Indie Music Showcase",
    schedule: "18 Mei 2026 - 19:30",
    seat: "VIP-B07",
    status: "Used",
  },
];

export default function MemberTicketScreen() {
  const { isDarkMode } = useThemeMode();

  return (
    <ScrollView
      className={`flex-1 ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}
      contentContainerClassName="px-5 py-6 pb-8"
    >
      <Text className={`font-manrope-bold text-3xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>
        Tiket Saya
      </Text>
      <Text className={`mt-2 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
        Halaman dummy untuk daftar tiket aktif dan tiket yang sudah digunakan.
      </Text>

      <View className="mt-5 gap-3">
        {TICKETS.map((ticket) => {
          const isActive = ticket.status === "Active";

          return (
            <View
              key={ticket.id}
              className={`rounded-2xl border p-4 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className={`font-manrope-semibold text-lg ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {ticket.eventName}
                  </Text>
                  <Text className={`mt-1 font-manrope ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {ticket.id}
                  </Text>
                </View>
                <View
                  className={`rounded-full px-3 py-1 ${
                    isActive ? "bg-emerald-500/15" : "bg-slate-500/20"
                  }`}
                >
                  <Text
                    className={`font-manrope-semibold text-xs ${
                      isActive ? "text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    {ticket.status}
                  </Text>
                </View>
              </View>

              <View className="mt-4 flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color={isDarkMode ? "#94a3b8" : "#475569"} />
                <Text className={`ml-2 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  {ticket.schedule}
                </Text>
              </View>
              <View className="mt-2 flex-row items-center">
                <Ionicons name="pricetag-outline" size={16} color={isDarkMode ? "#94a3b8" : "#475569"} />
                <Text className={`ml-2 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  Kursi {ticket.seat}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
