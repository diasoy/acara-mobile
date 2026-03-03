import { Pressable, Text, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { useThemeMode } from "@/hooks/useThemeMode";

export default function AdminProfileScreen() {
  const { user, isLoadingMe, refetchMe, logout } = useAuth();
  const { isDarkMode } = useThemeMode();

  return (
    <View className={`flex-1 px-6 py-8 ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}>
      <View
        className={`rounded-2xl border p-5 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
      >
        <Text className={`mb-4 text-2xl font-manrope-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          Profil Admin
        </Text>

        <Text className={`mt-2 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
          {isLoadingMe ? "Memuat profil..." : user?.fullName ?? "Admin"}
        </Text>
        <Text className={`mt-1 font-manrope ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
          {user?.email ?? "-"}
        </Text>
        <Text className={`mt-1 font-manrope ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
          Role: {user?.role ?? "-"}
        </Text>

        <View
          className={`mt-4 rounded-xl border p-4 ${isDarkMode ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-slate-50"}`}
        >
          <Text className={`font-manrope-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Akses admin
          </Text>
          <Text className={`mt-1 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
            Kelola event, transaksi, dan modul manajemen dari dashboard.
          </Text>
        </View>

        <View className="mt-6 gap-3">
          <Pressable className="rounded-lg bg-sky-500 py-3" onPress={() => void refetchMe()}>
            <Text className="text-center font-manrope-semibold text-white">Refresh Me</Text>
          </Pressable>

          <Pressable className="rounded-lg bg-rose-500 py-3" onPress={() => void logout()}>
            <Text className="text-center font-manrope-semibold text-white">Logout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
