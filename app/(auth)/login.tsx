import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { useThemeMode } from "@/hooks/useThemeMode";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

const LoginScreen = () => {
  const { login, loginPending } = useAuth();
  const { isDarkMode } = useThemeMode();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = identifier.trim().length > 0 && password.length > 0 && !loginPending;

  const onSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    try {
      await login({
        identifier: identifier.trim(),
        password,
      });
      router.replace("/");
    } catch (error) {
      Alert.alert("Login gagal", getApiErrorMessage(error, "Periksa data login kamu."));
    }
  };

  return (
    <View className={`flex-1 justify-center px-6 ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}>
      <View
        className={`rounded-2xl border p-5 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
      >
        <Text className={`mb-1 text-2xl font-manrope-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          Masuk
        </Text>
        <Text className={`mb-6 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
          Gunakan akun yang sudah terdaftar.
        </Text>

        <View className="mb-3">
          <Text className={`mb-2 font-manrope-medium ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
            Email / Username
          </Text>
          <TextInput
            className={`rounded-lg border px-4 py-3 font-manrope ${isDarkMode ? "border-slate-700 text-white" : "border-slate-300 text-slate-900"}`}
            placeholder="johndoe / email@domain.com"
            placeholderTextColor={isDarkMode ? "#94a3b8" : "#64748b"}
            autoCapitalize="none"
            value={identifier}
            onChangeText={setIdentifier}
          />
        </View>

        <View className="mb-5">
          <Text className={`mb-2 font-manrope-medium ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
            Password
          </Text>
          <TextInput
            className={`rounded-lg border px-4 py-3 font-manrope ${isDarkMode ? "border-slate-700 text-white" : "border-slate-300 text-slate-900"}`}
            placeholder="Password"
            placeholderTextColor={isDarkMode ? "#94a3b8" : "#64748b"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable
          className={`rounded-lg py-3 ${canSubmit ? "bg-emerald-500" : "bg-slate-700"}`}
          disabled={!canSubmit}
          onPress={onSubmit}
        >
          <Text className="text-center font-manrope-semibold text-white">
            {loginPending ? "Memproses..." : "Login"}
          </Text>
        </Pressable>

        <View className="mt-5 flex-row justify-center">
          <Text className={`font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
            Belum punya akun?{" "}
          </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text className="font-manrope-semibold text-emerald-400">Daftar</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
