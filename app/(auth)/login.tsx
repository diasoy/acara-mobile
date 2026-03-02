import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

const LoginScreen = () => {
  const { login, loginPending } = useAuth();
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
    <View className="flex-1 justify-center bg-slate-950 px-6">
      <View className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <Text className="mb-1 text-2xl font-manrope-bold text-white">Masuk</Text>
        <Text className="mb-6 font-manrope text-slate-300">Gunakan akun yang sudah terdaftar.</Text>

        <View className="mb-3">
          <Text className="mb-2 font-manrope-medium text-slate-200">Email / Username</Text>
          <TextInput
            className="rounded-lg border border-slate-700 px-4 py-3 font-manrope text-white"
            placeholder="johndoe / email@domain.com"
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            value={identifier}
            onChangeText={setIdentifier}
          />
        </View>

        <View className="mb-5">
          <Text className="mb-2 font-manrope-medium text-slate-200">Password</Text>
          <TextInput
            className="rounded-lg border border-slate-700 px-4 py-3 font-manrope text-white"
            placeholder="Password"
            placeholderTextColor="#94a3b8"
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
          <Text className="font-manrope text-slate-300">Belum punya akun? </Text>
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
