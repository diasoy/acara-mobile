import { Text, View } from "react-native";

const DUMMY_TRANSAKSI = [
  { id: "TRX-001", amount: "Rp120.000", status: "Berhasil" },
  { id: "TRX-002", amount: "Rp75.000", status: "Menunggu" },
  { id: "TRX-003", amount: "Rp250.000", status: "Gagal" },
];

export default function TransaksiTabScreen() {
  return (
    <View className="flex-1 bg-slate-950 px-6 py-8">
      <View className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <Text className="text-2xl font-bold text-white">Transaksi</Text>
        <Text className="mt-2 text-slate-300">Data transaksi dummy.</Text>

        <View className="mt-4 gap-3">
          {DUMMY_TRANSAKSI.map((item) => (
            <View key={item.id} className="rounded-xl border border-slate-700 bg-slate-950 p-4">
              <Text className="text-white">{item.id}</Text>
              <Text className="mt-1 text-slate-300">{item.amount}</Text>
              <Text className="mt-1 text-emerald-400">{item.status}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
