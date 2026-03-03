import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, Text, View } from "react-native";

import { useThemeMode } from "@/hooks/useThemeMode";

const BANNER_ITEMS = [
  { id: "BNR-01", title: "Ramadan Promo", position: "Top Slider", active: true },
  { id: "BNR-02", title: "Weekend Flash Sale", position: "Middle Slider", active: true },
  { id: "BNR-03", title: "Partner Showcase", position: "Bottom Slider", active: false },
];

export default function BannerScreen() {
  const { isDarkMode } = useThemeMode();

  return (
    <ScrollView
      className={`flex-1 ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}
      contentContainerClassName="px-5 py-6 pb-8"
    >
      <Text className={`font-manrope-bold text-3xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>
        Banner Settings
      </Text>
      <Text className={`mt-2 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
        Kelola urutan banner promosi agar tampil optimal di halaman utama.
      </Text>

      <View className="mt-5 gap-3">
        {BANNER_ITEMS.map((banner) => (
          <View
            key={banner.id}
            className={`rounded-2xl border p-4 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View
                  className={`h-10 w-10 items-center justify-center rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}
                >
                  <Ionicons name="images-outline" size={18} color={isDarkMode ? "#e2e8f0" : "#334155"} />
                </View>
                <View className="ml-3">
                  <Text className={`font-manrope-semibold text-lg ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {banner.title}
                  </Text>
                  <Text className={`font-manrope ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {banner.position}
                  </Text>
                </View>
              </View>

              <View
                className={`rounded-full px-3 py-1 ${banner.active ? "bg-emerald-500/15" : "bg-slate-500/20"}`}
              >
                <Text
                  className={`font-manrope-semibold text-xs ${banner.active ? "text-emerald-400" : "text-slate-400"}`}
                >
                  {banner.active ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
