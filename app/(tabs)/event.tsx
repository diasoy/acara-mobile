import { Redirect } from "expo-router";
import { Text, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";

export default function EventTabScreen() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <View className="flex-1 bg-slate-950 px-6 py-8">
      <View className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <Text className="text-2xl font-bold text-white">Event</Text>
        <Text className="mt-2 text-slate-300">
          Halaman event khusus admin (dummy).
        </Text>
      </View>
    </View>
  );
}
