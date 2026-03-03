import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useDeleteEvent, useDetailEvent, useUpdateEvent } from "@/hooks/useEvent";
import { buildEventUpdatePayload } from "@/lib/event-payload";
import type { Event } from "@/types/event";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

type EventFormState = {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  banner: string;
  category: string;
  locationAddress: string;
  isOnline: boolean;
};

const EMPTY_FORM_STATE: EventFormState = {
  name: "",
  startDate: "",
  endDate: "",
  description: "",
  banner: "",
  category: "",
  locationAddress: "",
  isOnline: false,
};

function formatDateInput(rawDate: string) {
  const parsedDate = new Date(rawDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return rawDate;
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const hour = String(parsedDate.getHours()).padStart(2, "0");
  const minute = String(parsedDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function toIsoDate(rawDate: string) {
  const parsedDate = new Date(rawDate.trim());

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString();
}

function buildFormState(event: Event): EventFormState {
  return {
    name: event.name ?? "",
    startDate: formatDateInput(event.startDate),
    endDate: formatDateInput(event.endDate),
    description: event.description ?? "",
    banner: event.banner ?? "",
    category: event.category ?? "",
    locationAddress: event.location?.address ?? "",
    isOnline: event.isOnline,
  };
}

export default function EventDetailScreen() {
  const { id, mode } = useLocalSearchParams<{ id?: string; mode?: string }>();
  const router = useRouter();
  const { data, isLoading, isError } = useDetailEvent(id || "");
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const [formState, setFormState] = useState<EventFormState>(EMPTY_FORM_STATE);

  const event = data?.data;
  const isUpdatingCurrentEvent = updateEventMutation.isPending
    && updateEventMutation.variables?.id === event?._id;
  const isDeletingCurrentEvent = deleteEventMutation.isPending
    && deleteEventMutation.variables === event?._id;
  const isActionDisabled = isUpdatingCurrentEvent || isDeletingCurrentEvent;

  useEffect(() => {
    setIsEditMode(mode === "edit");
  }, [id, mode]);

  useEffect(() => {
    if (!event) {
      return;
    }

    setFormState(buildFormState(event));
  }, [event]);

  const setField = <K extends keyof EventFormState>(
    key: K,
    value: EventFormState[K],
  ) => {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const runTogglePublish = async () => {
    if (!event) {
      return;
    }

    try {
      const nextStatus = !event.isPublish;

      await updateEventMutation.mutateAsync({
        id: event._id,
        payload: buildEventUpdatePayload(event, { isPublish: nextStatus }),
      });

      ToastAndroid.show(
        nextStatus
          ? "Event berhasil dipublish."
          : "Status event berhasil diubah ke draft.",
        ToastAndroid.SHORT,
      );
    } catch {
      // Toast error handled in service.
    }
  };

  const confirmTogglePublish = () => {
    if (!event || isActionDisabled || isEditMode) {
      return;
    }

    const actionLabel = event.isPublish ? "ubah ke draft" : "publish";

    Alert.alert("Update Event", `Yakin ingin ${actionLabel} event ini?`, [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Ya",
        onPress: () => {
          void runTogglePublish();
        },
      },
    ]);
  };

  const runToggleFeatured = async () => {
    if (!event) {
      return;
    }

    try {
      const nextStatus = !event.isFeatured;

      await updateEventMutation.mutateAsync({
        id: event._id,
        payload: buildEventUpdatePayload(event, { isFeatured: nextStatus }),
      });

      ToastAndroid.show(
        nextStatus
          ? "Event dijadikan featured."
          : "Event tidak featured lagi.",
        ToastAndroid.SHORT,
      );
    } catch {
      // Toast error handled in service.
    }
  };

  const confirmToggleFeatured = () => {
    if (!event || isActionDisabled || isEditMode) {
      return;
    }

    const actionLabel = event.isFeatured
      ? "hapus dari featured"
      : "jadikan featured";

    Alert.alert("Update Event", `Yakin ingin ${actionLabel}?`, [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Ya",
        onPress: () => {
          void runToggleFeatured();
        },
      },
    ]);
  };

  const runDeleteEvent = async () => {
    if (!event) {
      return;
    }

    try {
      await deleteEventMutation.mutateAsync(event._id);
      ToastAndroid.show("Event berhasil dihapus.", ToastAndroid.SHORT);
      router.replace("/(admin)/event");
    } catch {
      // Toast error handled in service.
    }
  };

  const confirmDeleteEvent = () => {
    if (!event || isActionDisabled) {
      return;
    }

    Alert.alert("Hapus Event", `Hapus event "${event.name}"?`, [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          void runDeleteEvent();
        },
      },
    ]);
  };

  const handleSaveEdit = async () => {
    if (!event || isActionDisabled) {
      return;
    }

    const trimmedName = formState.name.trim();
    const trimmedCategory = formState.category.trim();
    const trimmedDescription = formState.description.trim();
    const trimmedBanner = formState.banner.trim();
    const trimmedLocationAddress = formState.locationAddress.trim();

    if (!trimmedName) {
      ToastAndroid.show("Nama event wajib diisi.", ToastAndroid.SHORT);
      return;
    }

    if (!trimmedCategory) {
      ToastAndroid.show("Category wajib diisi.", ToastAndroid.SHORT);
      return;
    }

    const startDateIso = toIsoDate(formState.startDate);
    const endDateIso = toIsoDate(formState.endDate);

    if (!startDateIso || !endDateIso) {
      ToastAndroid.show(
        "Format tanggal tidak valid. Gunakan YYYY-MM-DDTHH:mm.",
        ToastAndroid.LONG,
      );
      return;
    }

    if (new Date(endDateIso).getTime() < new Date(startDateIso).getTime()) {
      ToastAndroid.show(
        "Tanggal selesai tidak boleh lebih awal dari tanggal mulai.",
        ToastAndroid.LONG,
      );
      return;
    }

    if (!formState.isOnline && !trimmedLocationAddress) {
      ToastAndroid.show("Lokasi event wajib diisi untuk event offline.", ToastAndroid.LONG);
      return;
    }

    if (!formState.isOnline && !event.location) {
      ToastAndroid.show(
        "Data koordinat lokasi belum tersedia. Ubah ke online atau lengkapi lokasi via API.",
        ToastAndroid.LONG,
      );
      return;
    }

    const nextLocation = formState.isOnline
      ? undefined
      : event.location
        ? {
            ...event.location,
            address: trimmedLocationAddress,
          }
        : undefined;

    try {
      await updateEventMutation.mutateAsync({
        id: event._id,
        payload: buildEventUpdatePayload(event, {
          name: trimmedName,
          startDate: startDateIso,
          endDate: endDateIso,
          description: trimmedDescription,
          banner: trimmedBanner || undefined,
          category: trimmedCategory,
          isOnline: formState.isOnline,
          location: nextLocation,
        }),
      });

      ToastAndroid.show("Event berhasil diperbarui.", ToastAndroid.SHORT);
      setIsEditMode(false);
    } catch {
      // Toast error handled in service.
    }
  };

  const handleCancelEdit = () => {
    if (!event || isActionDisabled) {
      return;
    }

    setFormState(buildFormState(event));
    setIsEditMode(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#09071d]">
        <ActivityIndicator size="large" color="#4b30ff" />
      </View>
    );
  }

  if (isError || !event) {
    return (
      <View className="flex-1 items-center justify-center bg-[#09071d] px-6">
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text className="mt-4 text-center font-manrope text-[#d6d1ff]">
          Gagal memuat detail event
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 rounded-xl bg-[#3d29ff] px-6 py-3"
        >
          <Text className="font-manrope-semibold text-white">Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-[#09071d]">
      <View className="flex-1">
        <View className="flex-row items-center border-b border-[#1e1a48] px-4 py-3">
          <Pressable
            onPress={() => router.back()}
            className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-[#1a1444]"
          >
            <Ionicons name="arrow-back" size={20} color="#f3f2ff" />
          </Pressable>
          <Text className="flex-1 font-manrope-bold text-xl text-[#f3f2ff]">
            Event Detail
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 py-4 pb-36"
          showsVerticalScrollIndicator={false}
        >
          <View className="h-48 overflow-hidden rounded-2xl border border-[#2b2366] bg-[#16103f]">
            {event.banner ? (
              <Image
                source={{ uri: event.banner }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <Ionicons name="image-outline" size={48} color="#8f8bb9" />
                <Text className="mt-2 font-manrope text-[#8f8bb9]">
                  No Banner
                </Text>
              </View>
            )}
          </View>

          <View className="mt-4 flex-row flex-wrap gap-2">
            {event.isFeatured && (
              <View className="rounded-md bg-[#664712] px-3 py-1">
                <Text className="font-manrope-bold text-xs text-[#ffc660]">
                  FEATURED
                </Text>
              </View>
            )}
            {event.isOnline && (
              <View className="rounded-md bg-[#113d7c] px-3 py-1">
                <Text className="font-manrope-bold text-xs text-[#7bc2ff]">
                  ONLINE
                </Text>
              </View>
            )}
            <View
              className={`rounded-md px-3 py-1 ${event.isPublish ? "bg-[#1b6e44]" : "bg-[#5b2a55]"}`}
            >
              <Text
                className={`font-manrope-bold text-xs ${event.isPublish ? "text-[#66f0aa]" : "text-[#ff9fdb]"}`}
              >
                {event.isPublish ? "PUBLISHED" : "DRAFT"}
              </Text>
            </View>
          </View>

          <View className="mt-3 flex-row gap-2">
            <Pressable
              onPress={confirmToggleFeatured}
              disabled={isActionDisabled || isEditMode}
              className="flex-1 flex-row items-center justify-center rounded-xl border border-[#2b2366] bg-[#1a1444] py-3 active:opacity-80 disabled:opacity-40"
            >
              {isUpdatingCurrentEvent ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons
                  name={event.isFeatured ? "star" : "star-outline"}
                  size={16}
                  color="#ffffff"
                />
              )}
              <Text className="ml-2 font-manrope-semibold text-xs text-white">
                {event.isFeatured ? "Unfeature" : "Feature"}
              </Text>
            </Pressable>

            <Pressable
              onPress={confirmTogglePublish}
              disabled={isActionDisabled || isEditMode}
              className="flex-1 flex-row items-center justify-center rounded-xl border border-[#2b2366] bg-[#1a1444] py-3 active:opacity-80 disabled:opacity-40"
            >
              {isUpdatingCurrentEvent ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons
                  name={event.isPublish ? "close-circle-outline" : "checkmark-circle-outline"}
                  size={16}
                  color="#ffffff"
                />
              )}
              <Text className="ml-2 font-manrope-semibold text-xs text-white">
                {event.isPublish ? "Set Draft" : "Publish"}
              </Text>
            </Pressable>
          </View>

          <Text className="mt-4 font-manrope-bold text-3xl leading-9 text-[#f3f2ff]">
            {event.name}
          </Text>

          {isEditMode ? (
            <View className="mt-6 rounded-2xl border border-[#1e1a4d] bg-[#0f0b2e] p-4">
              <Text className="font-manrope-bold text-lg text-[#f3f2ff]">
                Edit Event
              </Text>

              <Text className="mt-4 font-manrope text-xs text-[#8f8bb9]">
                Event Name
              </Text>
              <TextInput
                value={formState.name}
                onChangeText={(value) => setField("name", value)}
                placeholder="Masukkan nama event"
                placeholderTextColor="#7c78a7"
                className="mt-2 rounded-xl border border-[#2b2366] bg-[#14103a] px-3 py-2.5 font-manrope text-[#f3f2ff]"
              />

              <Text className="mt-4 font-manrope text-xs text-[#8f8bb9]">
                Category
              </Text>
              <TextInput
                value={formState.category}
                onChangeText={(value) => setField("category", value)}
                placeholder="Masukkan category id"
                placeholderTextColor="#7c78a7"
                className="mt-2 rounded-xl border border-[#2b2366] bg-[#14103a] px-3 py-2.5 font-manrope text-[#f3f2ff]"
              />

              <Text className="mt-4 font-manrope text-xs text-[#8f8bb9]">
                Start Date (YYYY-MM-DDTHH:mm)
              </Text>
              <TextInput
                value={formState.startDate}
                onChangeText={(value) => setField("startDate", value)}
                placeholder="2026-05-10T07:45"
                placeholderTextColor="#7c78a7"
                autoCapitalize="none"
                className="mt-2 rounded-xl border border-[#2b2366] bg-[#14103a] px-3 py-2.5 font-manrope text-[#f3f2ff]"
              />

              <Text className="mt-4 font-manrope text-xs text-[#8f8bb9]">
                End Date (YYYY-MM-DDTHH:mm)
              </Text>
              <TextInput
                value={formState.endDate}
                onChangeText={(value) => setField("endDate", value)}
                placeholder="2026-05-10T11:45"
                placeholderTextColor="#7c78a7"
                autoCapitalize="none"
                className="mt-2 rounded-xl border border-[#2b2366] bg-[#14103a] px-3 py-2.5 font-manrope text-[#f3f2ff]"
              />

              <Text className="mt-4 font-manrope text-xs text-[#8f8bb9]">
                Banner URL
              </Text>
              <TextInput
                value={formState.banner}
                onChangeText={(value) => setField("banner", value)}
                placeholder="https://..."
                placeholderTextColor="#7c78a7"
                autoCapitalize="none"
                className="mt-2 rounded-xl border border-[#2b2366] bg-[#14103a] px-3 py-2.5 font-manrope text-[#f3f2ff]"
              />

              <Text className="mt-4 font-manrope text-xs text-[#8f8bb9]">
                Event Mode
              </Text>
              <View className="mt-2 flex-row gap-2">
                <Pressable
                  onPress={() => setField("isOnline", true)}
                  className={`flex-1 items-center rounded-xl px-3 py-2.5 ${formState.isOnline ? "bg-[#2e8bff]" : "bg-[#14103a]"}`}
                >
                  <Text className="font-manrope-semibold text-xs text-white">
                    Online
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setField("isOnline", false)}
                  className={`flex-1 items-center rounded-xl px-3 py-2.5 ${formState.isOnline ? "bg-[#14103a]" : "bg-[#2e8bff]"}`}
                >
                  <Text className="font-manrope-semibold text-xs text-white">
                    Offline
                  </Text>
                </Pressable>
              </View>

              {!formState.isOnline && (
                <>
                  <Text className="mt-4 font-manrope text-xs text-[#8f8bb9]">
                    Location Address
                  </Text>
                  <TextInput
                    value={formState.locationAddress}
                    onChangeText={(value) => setField("locationAddress", value)}
                    placeholder="Masukkan alamat event"
                    placeholderTextColor="#7c78a7"
                    className="mt-2 rounded-xl border border-[#2b2366] bg-[#14103a] px-3 py-2.5 font-manrope text-[#f3f2ff]"
                  />
                </>
              )}

              <Text className="mt-4 font-manrope text-xs text-[#8f8bb9]">
                Description
              </Text>
              <TextInput
                value={formState.description}
                onChangeText={(value) => setField("description", value)}
                placeholder="Masukkan deskripsi event"
                placeholderTextColor="#7c78a7"
                multiline
                textAlignVertical="top"
                className="mt-2 h-32 rounded-xl border border-[#2b2366] bg-[#14103a] px-3 py-2.5 font-manrope text-[#f3f2ff]"
              />
            </View>
          ) : (
            <>
              <View className="mt-6 gap-3">
                <View className="rounded-xl border border-[#1e1a4d] bg-[#0f0b2e] p-4">
                  <View className="flex-row items-center">
                    <View className="h-10 w-10 items-center justify-center rounded-lg bg-[#1a1444]">
                      <Ionicons name="calendar-outline" size={20} color="#7bc2ff" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="font-manrope text-xs text-[#8f8bb9]">
                        Event Schedule
                      </Text>
                      <Text className="mt-0.5 font-manrope-semibold text-base text-[#f3f2ff]">
                        {dateFormatter.format(startDate)}
                      </Text>
                      {endDate.getTime() !== startDate.getTime() && (
                        <Text className="mt-0.5 font-manrope text-sm text-[#b7b2dc]">
                          Until: {dateFormatter.format(endDate)}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                <View className="rounded-xl border border-[#1e1a4d] bg-[#0f0b2e] p-4">
                  <View className="flex-row items-center">
                    <View className="h-10 w-10 items-center justify-center rounded-lg bg-[#1a1444]">
                      <Ionicons
                        name={event.isOnline ? "globe-outline" : "location-outline"}
                        size={20}
                        color="#7bc2ff"
                      />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="font-manrope text-xs text-[#8f8bb9]">
                        {event.isOnline ? "Online Event" : "Location"}
                      </Text>
                      <Text className="mt-0.5 font-manrope-semibold text-base text-[#f3f2ff]">
                        {event.isOnline
                          ? "Virtual Event"
                          : event.location?.address || "Location not set"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="rounded-xl border border-[#1e1a4d] bg-[#0f0b2e] p-4">
                  <View className="flex-row items-center">
                    <View className="h-10 w-10 items-center justify-center rounded-lg bg-[#1a1444]">
                      <Ionicons name="pricetag-outline" size={20} color="#7bc2ff" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="font-manrope text-xs text-[#8f8bb9]">
                        Category
                      </Text>
                      <Text className="mt-0.5 font-manrope-semibold text-base text-[#f3f2ff]">
                        {event.category || "Uncategorized"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="mt-6">
                <Text className="font-manrope-bold text-xl text-[#f3f2ff]">
                  Description
                </Text>
                <View className="mt-3 rounded-xl border border-[#1e1a4d] bg-[#0f0b2e] p-4">
                  <Text className="font-manrope text-base leading-6 text-[#b7b2dc]">
                    {event.description || "No description available."}
                  </Text>
                </View>
              </View>
            </>
          )}

          <View className="mt-6 rounded-xl border border-[#1e1a4d] bg-[#0f0b2e] p-4">
            <Text className="font-manrope-bold text-lg text-[#f3f2ff]">
              Event Information
            </Text>
            <View className="mt-3 gap-2">
              <View className="flex-row justify-between">
                <Text className="font-manrope text-sm text-[#8f8bb9]">
                  Event ID
                </Text>
                <Text className="font-manrope-medium text-sm text-[#f3f2ff]">
                  {event._id}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-manrope text-sm text-[#8f8bb9]">
                  Slug
                </Text>
                <Text className="font-manrope-medium text-sm text-[#f3f2ff]">
                  {event.slug}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-manrope text-sm text-[#8f8bb9]">
                  Created At
                </Text>
                <Text className="font-manrope-medium text-sm text-[#f3f2ff]">
                  {shortDateFormatter.format(new Date(event.createdAt))}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-manrope text-sm text-[#8f8bb9]">
                  Updated At
                </Text>
                <Text className="font-manrope-medium text-sm text-[#f3f2ff]">
                  {shortDateFormatter.format(new Date(event.updatedAt))}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 border-t border-[#1e1a48] bg-[#09071d] px-4 py-4">
          <View className="flex-row gap-3">
            {isEditMode ? (
              <>
                <Pressable
                  onPress={handleSaveEdit}
                  disabled={isActionDisabled}
                  className="flex-1 rounded-xl bg-[#3d29ff] py-3.5 active:opacity-80 disabled:opacity-40"
                >
                  <View className="flex-row items-center justify-center">
                    {isUpdatingCurrentEvent ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Ionicons name="save-outline" size={18} color="#ffffff" />
                    )}
                    <Text className="ml-2 font-manrope-bold text-base text-white">
                      Save Changes
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={handleCancelEdit}
                  disabled={isActionDisabled}
                  className="rounded-xl bg-[#1a1444] px-5 py-3.5 active:opacity-80 disabled:opacity-40"
                >
                  <Ionicons name="close-outline" size={18} color="#ffffff" />
                </Pressable>
              </>
            ) : (
              <Pressable
                onPress={() => setIsEditMode(true)}
                disabled={isActionDisabled}
                className="flex-1 rounded-xl bg-[#3d29ff] py-3.5 active:opacity-80 disabled:opacity-40"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="create-outline" size={18} color="#ffffff" />
                  <Text className="ml-2 font-manrope-bold text-base text-white">
                    Edit Event
                  </Text>
                </View>
              </Pressable>
            )}

            <Pressable
              onPress={confirmDeleteEvent}
              disabled={isActionDisabled}
              className="rounded-xl bg-[#7c2d2d] px-5 py-3.5 active:opacity-80 disabled:opacity-40"
            >
              {isDeletingCurrentEvent ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="trash-outline" size={18} color="#ffffff" />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
