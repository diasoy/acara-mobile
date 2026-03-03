import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, Text, View } from "react-native";

import { useThemeMode } from "@/hooks/useThemeMode";

const REPORT_ITEMS = [
  { id: "TRX-1001", amount: "Rp450.000", method: "VA BCA", status: "Success" },
  { id: "TRX-1002", amount: "Rp175.000", method: "QRIS", status: "Pending" },
  { id: "TRX-1003", amount: "Rp220.000", method: "E-Wallet", status: "Success" },
];

export default function TransactionScreen() {
  const { isDarkMode } = useThemeMode();

  return (
    <ScrollView
      className={`flex-1 ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}
      contentContainerClassName="px-5 py-6 pb-8"
    >
      <Text className={`font-manrope-bold text-3xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>
        Transaction Reports
      </Text>
      <Text className={`mt-2 font-manrope ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
        Ringkasan transaksi terbaru untuk monitoring pemasukan event.
      </Text>

      <View className="mt-5 rounded-2xl bg-emerald-500 p-4">
        <Text className="font-manrope-semibold text-slate-900">Total Hari Ini</Text>
        <Text className="mt-1 font-manrope-bold text-3xl text-slate-950">Rp3.450.000</Text>
      </View>

      <View className="mt-4 gap-3">
        {REPORT_ITEMS.map((trx) => {
          const isSuccess = trx.status === "Success";

          return (
            <View
              key={trx.id}
              className={`rounded-2xl border p-4 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className={`font-manrope-semibold text-lg ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {trx.id}
                  </Text>
                  <Text className={`font-manrope ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {trx.method}
                  </Text>
                </View>
                <View
                  className={`rounded-full px-3 py-1 ${
                    isSuccess ? "bg-emerald-500/15" : "bg-amber-500/20"
                  }`}
                >
                  <Text
                    className={`font-manrope-semibold text-xs ${
                      isSuccess ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {trx.status}
                  </Text>
                </View>
              </View>
              <View className="mt-3 flex-row items-center">
                <Ionicons name="cash-outline" size={16} color={isDarkMode ? "#94a3b8" : "#475569"} />
                <Text className={`ml-2 font-manrope-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {trx.amount}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
