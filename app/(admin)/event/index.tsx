import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, Text, View } from "react-native";

import { useThemeMode } from "@/hooks/useThemeMode";

const EVENT_ITEMS = [
  { id: "EV-001", name: "Summer Music Fest", date: "24 Apr 2026", status: "Published" },
  { id: "EV-002", name: "Tech Conference 2026", date: "02 Mei 2026", status: "Draft" },
  { id: "EV-003", name: "Startup Meetup", date: "19 Mei 2026", status: "Published" },
];

export default function EventScreen() {
  const { isDarkMode } = useThemeMode();

  return (
    <ScrollView
      className={`flex-1 ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}
      contentContainerClassName="px-5 py-6 pb-8"
    >
      <Text className={`font-manrope-bold text-3xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>
        Event Management
      </Text>
      <Text className={`mt-2 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
        Kelola daftar event, ubah jadwal, dan pantau status publikasi.
      </Text>

      <View className="mt-5 gap-3">
        {EVENT_ITEMS.map((event) => {
          const isPublished = event.status === "Published";

          return (
            <View
              key={event.id}
              className={`rounded-2xl border p-4 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className={`font-manrope-semibold text-lg ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {event.name}
                  </Text>
                  <Text className={`mt-1 font-manrope ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {event.id}
                  </Text>
                </View>
                <View
                  className={`rounded-full px-3 py-1 ${
                    isPublished ? "bg-emerald-500/15" : "bg-amber-500/20"
                  }`}
                >
                  <Text
                    className={`font-manrope-semibold text-xs ${
                      isPublished ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {event.status}
                  </Text>
                </View>
              </View>

              <View className="mt-4 flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color={isDarkMode ? "#94a3b8" : "#475569"} />
                <Text className={`ml-2 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  {event.date}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
