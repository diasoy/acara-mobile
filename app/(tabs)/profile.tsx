import { Pressable, Text, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";

export default function ProfileTabScreen() {
  const { user, isLoadingMe, refetchMe, logout } = useAuth();

  return (
    <View className="flex-1 bg-slate-950 px-6 py-8">
      <View className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <Text className="text-2xl font-manrope-bold text-white">Profile</Text>
        <Text className="mt-2 font-manrope text-slate-300">
          {isLoadingMe ? "Memuat profil..." : user?.fullName ?? "User"}
        </Text>
        <Text className="mt-1 font-manrope text-slate-400">{user?.email ?? "-"}</Text>
        <Text className="mt-1 font-manrope text-slate-400">{user?.role ?? "-"}</Text>

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
