import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

const RegisterScreen = () => {
  const { register, registerPending } = useAuth();
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const canSubmit =
    fullName.trim().length > 0 &&
    userName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    !registerPending;

  const onSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validasi gagal", "Password dan konfirmasi password tidak sama.");
      return;
    }

    try {
      const response = await register({
        fullName: fullName.trim(),
        userName: userName.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
      });

      Alert.alert("Registrasi berhasil", response.meta.message || "Akun berhasil dibuat.");
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Registrasi gagal", getApiErrorMessage(error));
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-950" contentContainerClassName="px-6 py-10">
      <View className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <Text className="mb-1 text-2xl font-manrope-bold text-white">Daftar</Text>
        <Text className="mb-6 font-manrope text-slate-300">
          Buat akun baru untuk mulai menggunakan aplikasi.
        </Text>

        <View className="mb-3">
          <Text className="mb-2 font-manrope-medium text-slate-200">Nama Lengkap</Text>
          <TextInput
            className="rounded-lg border border-slate-700 px-4 py-3 font-manrope text-white"
            placeholder="John Doe"
            placeholderTextColor="#94a3b8"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View className="mb-3">
          <Text className="mb-2 font-manrope-medium text-slate-200">Username</Text>
          <TextInput
            className="rounded-lg border border-slate-700 px-4 py-3 font-manrope text-white"
            placeholder="johndoe"
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            value={userName}
            onChangeText={setUserName}
          />
        </View>

        <View className="mb-3">
          <Text className="mb-2 font-manrope-medium text-slate-200">Email</Text>
          <TextInput
            className="rounded-lg border border-slate-700 px-4 py-3 font-manrope text-white"
            placeholder="john@domain.com"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="mb-3">
          <Text className="mb-2 font-manrope-medium text-slate-200">Password</Text>
          <TextInput
            className="rounded-lg border border-slate-700 px-4 py-3 font-manrope text-white"
            placeholder="********"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View className="mb-5">
          <Text className="mb-2 font-manrope-medium text-slate-200">Konfirmasi Password</Text>
          <TextInput
            className="rounded-lg border border-slate-700 px-4 py-3 font-manrope text-white"
            placeholder="********"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <Pressable
          className={`rounded-lg py-3 ${canSubmit ? "bg-emerald-500" : "bg-slate-700"}`}
          disabled={!canSubmit}
          onPress={onSubmit}
        >
          <Text className="text-center font-manrope-semibold text-white">
            {registerPending ? "Memproses..." : "Daftar"}
          </Text>
        </Pressable>

        <View className="mt-5 flex-row justify-center">
          <Text className="font-manrope text-slate-300">Sudah punya akun? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="font-manrope-semibold text-emerald-400">Login</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
