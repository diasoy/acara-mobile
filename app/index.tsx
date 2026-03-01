import { Redirect } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { isAuthHydrating, isAuthenticated, isLoadingMe, logout, refetchMe, user } = useAuth();

  if (isAuthHydrating) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator color="#10b981" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View className="flex-1 justify-center bg-slate-950 px-6">
      <View className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <Text className="text-2xl font-bold text-white">Authenticated</Text>
        <Text className="mt-2 text-slate-300">
          {isLoadingMe ? "Memuat profil..." : `Halo, ${user?.fullName ?? "User"}`}
          <Text className="text-slate-400"> ({user?.email})</Text>
          <Text className="text-slate-400"> ({user?.role})</Text>
          <Text className="text-slate-400"> ({user?.userName})</Text>
        </Text>

        <View className="mt-6 gap-3">
          <Pressable className="rounded-lg bg-sky-500 py-3" onPress={() => void refetchMe()}>
            <Text className="text-center font-semibold text-white">Refresh Me</Text>
          </Pressable>

          <Pressable className="rounded-lg bg-rose-500 py-3" onPress={() => void logout()}>
            <Text className="text-center font-semibold text-white">Logout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
