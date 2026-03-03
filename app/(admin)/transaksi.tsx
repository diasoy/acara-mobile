import { Text, View } from "react-native";

import { useThemeMode } from "@/hooks/useThemeMode";

const DUMMY_TRANSAKSI = [
  { id: "TRX-001", amount: "Rp120.000", status: "Berhasil" },
  { id: "TRX-002", amount: "Rp75.000", status: "Menunggu" },
  { id: "TRX-003", amount: "Rp250.000", status: "Gagal" },
];

export default function AdminTransaksiScreen() {
  const { isDarkMode } = useThemeMode();

  return (
    <View className={`flex-1 px-6 py-8 ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}>
      <View
        className={`rounded-2xl border p-5 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
      >
        <Text className={`text-2xl font-manrope-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          Transaksi Admin
        </Text>
        <Text className={`mt-2 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
          Pantau seluruh transaksi masuk di halaman admin.
        </Text>

        <View className="mt-4 gap-3">
          {DUMMY_TRANSAKSI.map((item) => (
            <View
              key={item.id}
              className={`rounded-xl border p-4 ${isDarkMode ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-slate-50"}`}
            >
              <Text className={`font-manrope-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {item.id}
              </Text>
              <Text className={`mt-1 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                {item.amount}
              </Text>
              <Text className="mt-1 font-manrope text-emerald-500">{item.status}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
