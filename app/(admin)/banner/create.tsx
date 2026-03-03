import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
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

import { useUploadMediaSingle } from "@/hooks/useMedia";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { createBanner } from "@/services/banner.service";
import type { CreateBannerPayload } from "@/types/banner";

export default function CreateBannerScreen() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const { mutate: uploadMedia, isPending: isUploading } =
    useUploadMediaSingle();

  const [formData, setFormData] = useState<CreateBannerPayload>({
    title: "",
    image: "",
    isShow: true,
  });

  const handlePickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

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
      console.error("Pick image error:", error);
      ToastAndroid.show("Gagal memilih gambar", ToastAndroid.SHORT);
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
          setFormData({ ...formData, image: media.secure_url });
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

  const handleCreate = async () => {
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
      await createBanner(formData);
      ToastAndroid.show("Banner berhasil dibuat", ToastAndroid.SHORT);
      router.back();
    } catch {
      ToastAndroid.show("Gagal membuat banner", ToastAndroid.SHORT);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-slate-950">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center border-b border-slate-800 px-4 py-3">
          <Pressable
            onPress={() => router.back()}
            className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-slate-800"
          >
            <Ionicons name="arrow-back" size={20} color="#f8fafc" />
          </Pressable>
          <Text className="flex-1 font-manrope-bold text-xl text-white">
            Create Banner
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 py-6 pb-28"
          showsVerticalScrollIndicator={false}
        >
          {/* Image Preview */}
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
                    No image``
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Form Fields */}
          <View className="gap-5">
            {/* Title */}
            <View>
              <Text className="font-manrope-semibold text-sm text-white">
                Title
              </Text>
              <TextInput
                value={formData.title}
                onChangeText={(text) =>
                  setFormData({ ...formData, title: text })
                }
                placeholder="Enter banner title..."
                placeholderTextColor="#64748b"
                className="mt-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 font-manrope text-white"
              />
            </View>

            {/* Image Picker Section */}
            <View>
              <Text className="font-manrope-semibold text-sm text-white">
                Upload Image
              </Text>

              {/* Selected Image Preview */}
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

              {/* Pick & Upload Buttons */}
              <View className="mt-3 flex-row gap-2">
                <Pressable
                  onPress={handlePickImage}
                  disabled={isUploading}
                  className="flex-1 flex-row items-center justify-center rounded-lg border border-slate-600 bg-slate-900 py-3"
                >
                  <Ionicons
                    name="image-outline"
                    size={16}
                    color={isUploading ? "#94a3b8" : "#e2e8f0"}
                  />
                  <Text
                    className={`ml-2 font-manrope-semibold text-sm ${isUploading ? "text-slate-400" : "text-white"}`}
                  >
                    Pick Image
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleUploadImage}
                  disabled={!selectedImage || isUploading}
                  className={`flex-1 flex-row items-center justify-center rounded-lg py-3 ${
                    !selectedImage || isUploading
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

              {/* URL Status */}
              {formData.image && (
                <View className="mt-3 flex-row items-center rounded-lg border border-green-600/30 bg-green-600/10 px-3 py-2">
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text className="ml-2 flex-1 font-manrope text-xs text-green-400">
                    Image uploaded successfully
                  </Text>
                </View>
              )}
            </View>

            {/* Is Show */}
            <View className="flex-row items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-4 py-3">
              <Text className="font-manrope-semibold text-sm text-white">
                Show on Homepage
              </Text>
              <Switch
                value={formData.isShow}
                onValueChange={(value) =>
                  setFormData({ ...formData, isShow: value })
                }
                trackColor={{ false: "#475569", true: "#10b981" }}
                thumbColor={formData.isShow ? "#34d399" : "#94a3b8"}
              />
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="border-t border-slate-800 bg-slate-950 px-4 py-4">
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => router.back()}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900 py-3"
            >
              <Text className="text-center font-manrope-semibold text-white">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleCreate}
              disabled={isSaving || !formData.image?.trim()}
              className={`flex-1 items-center justify-center rounded-lg py-3 ${
                isSaving || !formData.image?.trim()
                  ? "bg-slate-500"
                  : "bg-blue-600"
              }`}
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  className={`font-manrope-semibold ${
                    !formData.image?.trim() ? "text-slate-300" : "text-white"
                  }`}
                >
                  Create Banner
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
