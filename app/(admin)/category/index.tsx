import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, Text, View } from "react-native";

import { useThemeMode } from "@/hooks/useThemeMode";

const CATEGORY_ITEMS = [
  { id: "CAT-01", name: "Music", total: 18 },
  { id: "CAT-02", name: "Technology", total: 12 },
  { id: "CAT-03", name: "Business", total: 9 },
  { id: "CAT-04", name: "Lifestyle", total: 6 },
];

export default function CategoryScreen() {
  const { isDarkMode } = useThemeMode();

  return (
    <ScrollView
      className={`flex-1 ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}
      contentContainerClassName="px-5 py-6 pb-8"
    >
      <Text className={`font-manrope-bold text-3xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>
        Category List
      </Text>
      <Text className={`mt-2 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
        Atur kategori dan tag untuk klasifikasi event di aplikasi.
      </Text>

      <View className="mt-5 gap-3">
        {CATEGORY_ITEMS.map((category) => (
          <View
            key={category.id}
            className={`rounded-2xl border p-4 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View
                  className={`h-10 w-10 items-center justify-center rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}
                >
                  <Ionicons name="pricetag-outline" size={18} color={isDarkMode ? "#e2e8f0" : "#334155"} />
                </View>
                <View className="ml-3">
                  <Text className={`font-manrope-semibold text-lg ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {category.name}
                  </Text>
                  <Text className={`font-manrope ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {category.id}
                  </Text>
                </View>
              </View>

              <View className="rounded-full bg-emerald-500/15 px-3 py-1">
                <Text className="font-manrope-semibold text-emerald-400">
                  {category.total} event
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
