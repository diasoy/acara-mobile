import { Pressable, ScrollView, Text, View } from "react-native";

import { useThemeMode } from "@/hooks/useThemeMode";

const EVENT_LIST = [
  {
    id: "event-01",
    title: "Frontend Conference 2026",
    date: "10 Mei 2026",
    venue: "ICE BSD, Tangerang",
    price: "Rp250.000",
  },
  {
    id: "event-02",
    title: "Indie Music Showcase",
    date: "18 Mei 2026",
    venue: "Taman Ismail Marzuki, Jakarta",
    price: "Rp175.000",
  },
  {
    id: "event-03",
    title: "Startup Networking Night",
    date: "24 Mei 2026",
    venue: "Bandung Creative Hub",
    price: "Gratis",
  },
];

export default function MemberEventScreen() {
  const { isDarkMode } = useThemeMode();

  return (
    <ScrollView
      className={`flex-1 ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}
      contentContainerClassName="px-6 py-8"
    >
      <Text className={`font-manrope-bold text-3xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>
        Event Member
      </Text>
      <Text className={`mt-2 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
        Temukan event terbaru dan daftar langsung dari sini.
      </Text>

      <View className="mt-5 gap-3">
        {EVENT_LIST.map((event) => (
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
            <Text className={`mt-1 font-manrope ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              {event.venue}
            </Text>
            <Text className="mt-2 font-manrope-medium text-emerald-500">{event.price}</Text>

            <Pressable className="mt-3 rounded-lg bg-emerald-500 py-2.5">
              <Text className="text-center font-manrope-semibold text-slate-950">Daftar Event</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
