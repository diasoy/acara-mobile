import { Text, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";

export default function HomeTabScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1 bg-slate-950 px-6 py-8">
      <View className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <Text className="text-2xl font-bold text-white">Home</Text>
        <Text className="mt-2 text-slate-300">
          Selamat datang, {user?.fullName ?? "User"}.
        </Text>
        <Text className="mt-1 text-slate-400">
          Role kamu: {user?.role ?? "-"} | Username: {user?.userName ?? "-"}
        </Text>
      </View>
    </View>
  );
}
