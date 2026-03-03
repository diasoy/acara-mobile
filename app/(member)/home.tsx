import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/useAuth";
import { useThemeMode } from "@/hooks/useThemeMode";

const quickActions = [
  { id: "discover", title: "Jelajah Event", icon: "compass-outline" as const },
  { id: "tickets", title: "Tiket Saya", icon: "ticket-outline" as const },
  { id: "history", title: "Riwayat", icon: "time-outline" as const },
  { id: "wishlist", title: "Wishlist", icon: "heart-outline" as const },
];

const recommendedEvents = [
  { id: "ev-01", title: "Music Night Jakarta", date: "12 Apr 2026", price: "Mulai Rp150.000" },
  { id: "ev-02", title: "Tech Career Expo", date: "20 Apr 2026", price: "Mulai Rp80.000" },
  { id: "ev-03", title: "Food Carnival", date: "27 Apr 2026", price: "Gratis" },
];

export default function MemberHomeScreen() {
  const { user } = useAuth();
  const { isDarkMode } = useThemeMode();

  return (
    <SafeAreaView edges={["top"]} className={`flex-1 ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}>
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-8">
        <View className="pt-2">
          <Text className={`font-manrope text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Selamat datang kembali,
          </Text>
          <Text className={`font-manrope-bold text-2xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            {user?.fullName ?? "Member"}
          </Text>
        </View>

        <View className="mt-5 rounded-2xl bg-emerald-500 p-5">
          <Text className="font-manrope-semibold text-slate-900">Member Benefit</Text>
          <Text className="mt-1 font-manrope-bold text-2xl text-slate-950">
            120 Poin Aktif
          </Text>
          <Text className="mt-1 font-manrope text-slate-900">
            Kumpulkan poin dari setiap pembelian tiket.
          </Text>
        </View>

        <Text className={`mt-6 font-manrope-bold text-xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          Menu Cepat
        </Text>
        <View className="mt-3 flex-row flex-wrap justify-between">
          {quickActions.map((action) => (
            <View
              key={action.id}
              className={`mb-3 w-[48.5%] rounded-2xl p-4 ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
            >
              <View
                className={`h-9 w-9 items-center justify-center rounded-lg ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}
              >
                <Ionicons name={action.icon} size={18} color="#34d399" />
              </View>
              <Text className={`mt-3 font-manrope-semibold text-base ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {action.title}
              </Text>
            </View>
          ))}
        </View>

        <Text className={`mt-3 font-manrope-bold text-xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          Rekomendasi Event
        </Text>
        <View className="mt-3 gap-3">
          {recommendedEvents.map((event) => (
            <View
              key={event.id}
              className={`rounded-2xl border p-4 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
            >
              <Text className={`font-manrope-semibold text-lg ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {event.title}
              </Text>
              <Text className={`mt-1 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                {event.date}
              </Text>
              <Text className="mt-1 font-manrope-medium text-emerald-500">{event.price}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
