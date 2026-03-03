import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useBannerById,
  useDeleteBanner,
  useUpdateBanner,
} from "@/hooks/useBanner";
import { useRemoveMedia, useUploadMediaSingle } from "@/hooks/useMedia";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import type { UpdateBannerPayload } from "@/types/banner";

export default function EditBannerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useBannerById(id || "");
  const updateBannerMutation = useUpdateBanner();
  const deleteBannerMutation = useDeleteBanner();
  const removeMediaMutation = useRemoveMedia();
  const { mutate: uploadMedia, isPending: isUploading } = useUploadMediaSingle();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [originalImage, setOriginalImage] = useState("");
  const [formData, setFormData] = useState<UpdateBannerPayload>({
    title: "",
    image: "",
    isShow: true,
  });

  const banner = data?.data;
  const isBusy = isSaving
    || isUploading
    || updateBannerMutation.isPending
    || deleteBannerMutation.isPending
    || removeMediaMutation.isPending;

  useEffect(() => {
    if (!banner) {
      return;
    }

    setFormData({
      title: banner.title,
      image: banner.image,
      isShow: banner.isShow,
    });
    setOriginalImage(banner.image || "");
  }, [banner]);

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        ToastAndroid.show("Izin akses galeri diperlukan", ToastAndroid.SHORT);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const asset = result.assets[0];
      const fileName = asset.fileName || asset.uri.split("/").pop() || "image.jpg";
      const fileType = asset.mimeType || "image/jpeg";

      setSelectedImage({
        uri: asset.uri,
        name: fileName,
        type: fileType,
      });
    } catch (error) {
      ToastAndroid.show(
        getApiErrorMessage(error, "Gagal memilih gambar"),
        ToastAndroid.SHORT,
      );
    }
  };

  const handleUploadImage = () => {
    if (!selectedImage) {
      ToastAndroid.show("Pilih gambar terlebih dahulu", ToastAndroid.SHORT);
      return;
    }

    uploadMedia(
      {
        file: selectedImage,
      },
      {
        onSuccess: (media) => {
          setFormData((current) => ({ ...current, image: media.secure_url }));
          setSelectedImage(null);
          ToastAndroid.show("Gambar berhasil diupload", ToastAndroid.SHORT);
        },
        onError: (error) => {
          ToastAndroid.show(
            getApiErrorMessage(error, "Gagal upload gambar"),
            ToastAndroid.SHORT,
          );
        },
      },
    );
  };

  const removeOldImageIfChanged = async () => {
    const currentImage = originalImage.trim();
    const nextImage = (formData.image || "").trim();

    if (!currentImage || currentImage === nextImage) {
      return;
    }

    try {
      await removeMediaMutation.mutateAsync({ fileUrl: currentImage });
    } catch {
      ToastAndroid.show(
        "Banner diperbarui, tetapi gambar lama gagal dihapus.",
        ToastAndroid.SHORT,
      );
    }
  };

  const handleSave = async () => {
    if (!id || !banner) {
      return;
    }

    if (!formData.title?.trim()) {
      ToastAndroid.show("Masukkan judul banner", ToastAndroid.SHORT);
      return;
    }

    if (!formData.image?.trim()) {
      ToastAndroid.show("Upload gambar terlebih dahulu", ToastAndroid.SHORT);
      return;
    }

    try {
      setIsSaving(true);
      await updateBannerMutation.mutateAsync({
        id,
        payload: {
          title: formData.title.trim(),
          image: formData.image.trim(),
          isShow: !!formData.isShow,
        },
      });
      await removeOldImageIfChanged();
      setOriginalImage(formData.image.trim());

      ToastAndroid.show("Banner berhasil diperbarui", ToastAndroid.SHORT);
      router.back();
    } catch (error) {
      ToastAndroid.show(
        getApiErrorMessage(error, "Gagal memperbarui banner"),
        ToastAndroid.SHORT,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const runDelete = async () => {
    if (!id || !banner) {
      return;
    }

    const imageToDelete = (formData.image || originalImage || "").trim();

    try {
      await deleteBannerMutation.mutateAsync(id);

      if (imageToDelete) {
        try {
          await removeMediaMutation.mutateAsync({ fileUrl: imageToDelete });
        } catch {
          ToastAndroid.show(
            "Banner terhapus, tetapi gambar lama gagal dihapus.",
            ToastAndroid.SHORT,
          );
        }
      }

      ToastAndroid.show("Banner berhasil dihapus", ToastAndroid.SHORT);
      router.back();
    } catch (error) {
      ToastAndroid.show(
        getApiErrorMessage(error, "Gagal menghapus banner"),
        ToastAndroid.SHORT,
      );
    }
  };

  const handleDelete = () => {
    if (isBusy) {
      return;
    }

    Alert.alert("Hapus Banner", "Yakin ingin menghapus banner ini?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          void runDelete();
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (isError || !banner) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950 px-6">
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text className="mt-4 text-center font-manrope text-white">
          Gagal memuat detail banner
        </Text>
        <Pressable
          onPress={() => {
            void refetch();
          }}
          className="mt-4 rounded-xl bg-blue-600 px-6 py-3"
        >
          <Text className="font-manrope-semibold text-white">Coba Lagi</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-slate-950">
      <View className="flex-1">
        <View className="flex-row items-center border-b border-slate-800 px-4 py-3">
          <Pressable
            onPress={() => router.back()}
            className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-slate-800"
          >
            <Ionicons name="arrow-back" size={20} color="#f8fafc" />
          </Pressable>
          <Text className="flex-1 font-manrope-bold text-xl text-white">
            Banner Detail
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 py-6 pb-28"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-6">
            <Text className="font-manrope-semibold text-base text-white">
              Preview
            </Text>
            <View className="mt-3 h-40 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
              {formData.image?.trim() ? (
                <Image
                  source={{ uri: formData.image }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <Ionicons name="image-outline" size={48} color="#64748b" />
                  <Text className="mt-2 font-manrope text-slate-400">
                    No image
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="gap-5">
            <View>
              <Text className="font-manrope-semibold text-sm text-white">
                Title
              </Text>
              <TextInput
                value={formData.title || ""}
                onChangeText={(text) =>
                  setFormData((current) => ({ ...current, title: text }))
                }
                placeholder="Enter banner title..."
                placeholderTextColor="#64748b"
                editable={!isBusy}
                className="mt-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 font-manrope text-white"
              />
            </View>

            <View>
              <Text className="font-manrope-semibold text-sm text-white">
                Upload Image
              </Text>

              {selectedImage && (
                <View className="mt-3 overflow-hidden rounded-xl border border-slate-600 bg-slate-800">
                  <Image
                    source={{ uri: selectedImage.uri }}
                    className="h-32 w-full"
                    resizeMode="cover"
                  />
                  <View className="flex-row items-center justify-between border-t border-slate-600 px-3 py-2">
                    <Text className="flex-1 font-manrope text-xs text-slate-300">
                      {selectedImage.name}
                    </Text>
                    <Pressable
                      onPress={() => setSelectedImage(null)}
                      className="ml-2 h-6 w-6 items-center justify-center rounded bg-red-600"
                    >
                      <Ionicons name="close" size={14} color="white" />
                    </Pressable>
                  </View>
                </View>
              )}

              <View className="mt-3 flex-row gap-2">
                <Pressable
                  onPress={handlePickImage}
                  disabled={isBusy}
                  className={`flex-1 flex-row items-center justify-center rounded-lg border py-3 ${
                    isBusy
                      ? "border-slate-600 bg-slate-800"
                      : "border-slate-600 bg-slate-900"
                  }`}
                >
                  <Ionicons
                    name="image-outline"
                    size={16}
                    color={isBusy ? "#64748b" : "#e2e8f0"}
                  />
                  <Text
                    className={`ml-2 font-manrope-semibold text-sm ${isBusy ? "text-slate-500" : "text-white"}`}
                  >
                    Pick Image
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleUploadImage}
                  disabled={!selectedImage || isBusy}
                  className={`flex-1 flex-row items-center justify-center rounded-lg py-3 ${
                    !selectedImage || isBusy
                      ? "bg-slate-700"
                      : "bg-amber-600"
                  }`}
                >
                  {isUploading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Ionicons
                        name="cloud-upload-outline"
                        size={16}
                        color="white"
                      />
                      <Text className="ml-2 font-manrope-semibold text-sm text-white">
                        Upload
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>

            <View className="flex-row items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-4 py-3">
              <Text className="font-manrope-semibold text-sm text-white">
                Show on Homepage
              </Text>
              <Switch
                value={formData.isShow || false}
                onValueChange={(value) =>
                  setFormData((current) => ({ ...current, isShow: value }))
                }
                disabled={isBusy}
                trackColor={{ false: "#475569", true: "#10b981" }}
                thumbColor={formData.isShow ? "#34d399" : "#94a3b8"}
              />
            </View>

            <View className="rounded-lg border border-slate-700 bg-slate-900 p-4">
              <Text className="font-manrope-semibold text-sm text-white">
                Banner Information
              </Text>
              <View className="mt-3 gap-2">
                <Text className="font-manrope text-xs text-slate-300">
                  ID: {banner._id}
                </Text>
                <Text className="font-manrope text-xs text-slate-300">
                  Created: {new Date(banner.createdAt).toLocaleString("id-ID")}
                </Text>
                <Text className="font-manrope text-xs text-slate-300">
                  Updated: {new Date(banner.updatedAt).toLocaleString("id-ID")}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="border-t border-slate-800 bg-slate-950 px-4 py-4">
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => router.back()}
              disabled={isBusy}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900 py-3"
            >
              <Text className="text-center font-manrope-semibold text-white">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={isBusy || !formData.image?.trim()}
              className={`flex-1 items-center justify-center rounded-lg py-3 ${
                isBusy || !formData.image?.trim()
                  ? "bg-slate-500"
                  : "bg-blue-600"
              }`}
            >
              {isSaving || updateBannerMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  className={`font-manrope-semibold ${
                    !formData.image?.trim() ? "text-slate-300" : "text-white"
                  }`}
                >
                  Save Changes
                </Text>
              )}
            </Pressable>
          </View>

          <Pressable
            onPress={handleDelete}
            disabled={isBusy}
            className="mt-3 items-center rounded-lg bg-red-600 py-3 disabled:opacity-60"
          >
            {deleteBannerMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-manrope-semibold text-white">
                Delete Banner
              </Text>
            )}
          </Pressable>

          {isRefetching && (
            <View className="mt-2 flex-row items-center justify-center">
              <ActivityIndicator size="small" color="#64748b" />
              <Text className="ml-2 font-manrope text-xs text-slate-400">
                Memperbarui detail...
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
