import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useBanners } from "@/hooks/useBanner";
import { useThemeMode } from "@/hooks/useThemeMode";

export default function BannerScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeMode();
  const { data, isLoading, isError } = useBanners();

  if (isLoading) {
    return (
      <View
        className={`flex-1 items-center justify-center ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}
      >
        <ActivityIndicator
          size="large"
          color={isDarkMode ? "#60a5fa" : "#3b82f6"}
        />
      </View>
    );
  }

  if (isError || !data?.data) {
    return (
      <View
        className={`flex-1 items-center justify-center ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}
      >
        <Text
          className={`font-manrope ${isDarkMode ? "text-white" : "text-slate-900"}`}
        >
          Gagal memuat banner
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={["bottom"]}
      className={`flex-1 ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}
    >
      <ScrollView
        className={`flex-1 ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}
        contentContainerClassName="px-5 py-6 pb-8"
      >
        <Text
          className={`font-manrope-bold text-3xl ${isDarkMode ? "text-white" : "text-slate-900"}`}
        >
          Banner Settings
        </Text>
        <Text
          className={`mt-2 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
        >
          Kelola banner promosi agar tampil optimal di halaman utama.
        </Text>

        <View className="mt-5 gap-4">
          {data.data.map((banner) => (
            <View
              key={banner._id}
              className={`overflow-hidden rounded-2xl border ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
            >
              {/* Banner Image */}
              <View className="h-40 w-full overflow-hidden bg-slate-700">
                {banner.image ? (
                  <Image
                    source={{ uri: banner.image }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-full w-full items-center justify-center bg-slate-300">
                    <Ionicons name="image-outline" size={32} color="#64748b" />
                  </View>
                )}
              </View>

              {/* Banner Info */}
              <View className="p-4">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text
                      className={`font-manrope-semibold text-lg ${isDarkMode ? "text-white" : "text-slate-900"}`}
                    >
                      {banner.title}
                    </Text>
                    <Text
                      numberOfLines={2}
                      className={`mt-1 font-manrope text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {banner._id}
                    </Text>
                  </View>

                  <View
                    className={`rounded-full px-3 py-1 ${banner.isShow ? "bg-emerald-500/15" : "bg-slate-500/20"}`}
                  >
                    <Text
                      className={`font-manrope-semibold text-xs ${banner.isShow ? "text-emerald-400" : "text-slate-400"}`}
                    >
                      {banner.isShow ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>

                {/* Created Date */}
                <View className="mt-3 flex-row items-center">
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={isDarkMode ? "#94a3b8" : "#64748b"}
                  />
                  <Text
                    className={`ml-2 font-manrope text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                  >
                    {new Date(banner.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>

                {/* Action Buttons */}
                <View className="mt-4 flex-row gap-2">
                  <Pressable
                    onPress={() =>
                      router.push(`/(admin)/banner/${banner._id}` as any)
                    }
                    className={`flex-1 flex-row items-center justify-center rounded-lg py-2 ${isDarkMode ? "bg-blue-600" : "bg-blue-500"}`}
                  >
                    <Ionicons name="create-outline" size={14} color="white" />
                    <Text className="ml-2 font-manrope-semibold text-xs text-white">
                      Edit
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      /* TODO: Implement delete */
                    }}
                    className={`flex-1 flex-row items-center justify-center rounded-lg py-2 ${isDarkMode ? "bg-red-600" : "bg-red-500"}`}
                  >
                    <Ionicons name="trash-outline" size={14} color="white" />
                    <Text className="ml-2 font-manrope-semibold text-xs text-white">
                      Delete
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>

        {data.data.length === 0 && (
          <View className="mt-10 items-center">
            <Ionicons name="images-outline" size={48} color="#64748b" />
            <Text
              className={`mt-3 font-manrope-medium text-lg ${isDarkMode ? "text-slate-500" : "text-slate-600"}`}
            >
              Tidak ada banner
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        onPress={() => router.push("/(admin)/banner/create" as any)}
        className="absolute bottom-8 right-5 h-14 w-14 items-center justify-center rounded-full bg-blue-600 active:opacity-80"
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}
