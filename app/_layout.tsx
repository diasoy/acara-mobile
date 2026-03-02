import "../global.css";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Text, TextInput, View } from "react-native";

import { AuthProvider } from "@/hooks/useAuth";
import { queryClient } from "@/lib/query-client";

let hasAppliedDefaultFont = false;

function applyGlobalFontDefaults() {
  if (hasAppliedDefaultFont) {
    return;
  }

  const textComponent = Text as typeof Text & { defaultProps?: { style?: unknown } };
  const inputComponent = TextInput as typeof TextInput & { defaultProps?: { style?: unknown } };

  const textDefaults = textComponent.defaultProps ?? {};
  const inputDefaults = inputComponent.defaultProps ?? {};

  textComponent.defaultProps = {
    ...textDefaults,
    style: [{ fontFamily: "Manrope_400Regular" }, textDefaults.style].filter(Boolean),
  };

  inputComponent.defaultProps = {
    ...inputDefaults,
    style: [{ fontFamily: "Manrope_400Regular" }, inputDefaults.style].filter(Boolean),
  };

  hasAppliedDefaultFont = true;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator color="#10b981" />
      </View>
    );
  }

  applyGlobalFontDefaults();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="light" backgroundColor="#09071d" translucent={false} />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
