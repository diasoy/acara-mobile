import "../global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

import { AuthProvider } from "@/hooks/useAuth";
import { queryClient } from "@/lib/query-client";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
