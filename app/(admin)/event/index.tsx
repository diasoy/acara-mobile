import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
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

import { useDeleteEvent, useEvents } from "@/hooks/useEvent";
import type { Event } from "@/types/event";

type EventFilter = "all" | "published" | "draft" | "featured";
type BadgeTone = "published" | "draft" | "featured" | "online";

const EVENT_FILTERS: { key: EventFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "featured", label: "Featured" },
];

const BADGE_STYLES: Record<BadgeTone, { bg: string; text: string }> = {
  published: { bg: "#1b6e44", text: "#66f0aa" },
  draft: { bg: "#5b2a55", text: "#ff9fdb" },
  featured: { bg: "#664712", text: "#ffc660" },
  online: { bg: "#113d7c", text: "#7bc2ff" },
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
});

function getEventTimestamp(rawDate: string) {
  const parsedDate = new Date(rawDate);
  const timestamp = parsedDate.getTime();

  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
}

function formatEventDate(rawDate: string) {
  const parsedDate = new Date(rawDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Tanggal belum tersedia";
  }

  return `${dateFormatter.format(parsedDate)} - ${timeFormatter.format(parsedDate)}`;
}

function getEventLocation(event: Event) {
  if (event.isOnline) {
    return "Online Event";
  }

  const locationAddress = event.location?.address?.trim();

  return locationAddress && locationAddress.length > 0
    ? locationAddress
    : "Lokasi belum ditentukan";
}

function StatusBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  const colorScheme = BADGE_STYLES[tone];

  return (
    <View
      className="rounded-md px-2 py-0.5"
      style={{ backgroundColor: colorScheme.bg }}
    >
      <Text
        className="font-manrope-bold text-[10px]"
        style={{ color: colorScheme.text }}
      >
        {label}
      </Text>
    </View>
  );
}

type EventCardProps = {
  event: Event;
  onOpenDetail: (id: string) => void;
  onOpenEdit: (id: string) => void;
  onDelete: (event: Event) => void;
  isDeleting: boolean;
};

function EventCard({
  event,
  onOpenDetail,
  onOpenEdit,
  onDelete,
  isDeleting,
}: EventCardProps) {
  const badges: { tone: BadgeTone; label: string }[] = [];

  if (event.isFeatured) {
    badges.push({ tone: "featured", label: "FEATURED" });
  }

  if (event.isOnline) {
    badges.push({ tone: "online", label: "ONLINE" });
  }

  badges.push({
    tone: event.isPublish ? "published" : "draft",
    label: event.isPublish ? "PUBLISHED" : "DRAFT",
  });

  return (
    <View className="rounded-2xl border border-[#1e1a4d] bg-[#0f0b2e] p-3">
      <View className="flex-row">
        <View className="h-20 w-20 overflow-hidden rounded-xl border border-[#2b2366] bg-[#16103f]">
          {event.banner ? (
            <Image source={{ uri: event.banner }} className="h-full w-full" />
          ) : (
            <View className="h-full w-full items-center justify-center">
              <Ionicons name="image-outline" size={22} color="#8f8bb9" />
            </View>
          )}
        </View>

        <View className="ml-3 flex-1">
          <Text
            numberOfLines={2}
            className="font-manrope-bold text-[18px] leading-6 text-[#f3f2ff]"
          >
            {event.name}
          </Text>

          <View className="mt-1 flex-row items-center">
            <Ionicons name="calendar-clear-outline" size={14} color="#8f8bb9" />
            <Text
              numberOfLines={1}
              className="ml-1.5 font-manrope text-[12px] text-[#b7b2dc]"
            >
              {formatEventDate(event.startDate)}
            </Text>
          </View>

          <View className="mt-1 flex-row items-center">
            <Ionicons
              name={event.isOnline ? "globe-outline" : "location-outline"}
              size={14}
              color="#8f8bb9"
            />
            <Text
              numberOfLines={1}
              className="ml-1.5 flex-1 font-manrope text-[12px] text-[#b7b2dc]"
            >
              {getEventLocation(event)}
            </Text>
          </View>

          <View className="mt-2 flex-row flex-wrap gap-1.5">
            {badges.map((badge) => (
              <StatusBadge
                key={`${event._id}-${badge.label}`}
                label={badge.label}
                tone={badge.tone}
              />
            ))}
          </View>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => onOpenEdit(event._id)}
            disabled={isDeleting}
            className="h-8 w-8 items-center justify-center rounded-lg bg-[#251d5a] active:opacity-80 disabled:opacity-40"
          >
            <Ionicons name="create-outline" size={14} color="#f3f2ff" />
          </Pressable>
          <Pressable
            onPress={() => onDelete(event)}
            disabled={isDeleting}
            className="ml-2 h-8 w-8 items-center justify-center rounded-lg bg-[#251d5a] active:opacity-80 disabled:opacity-40"
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#f3f2ff" />
            ) : (
              <Ionicons name="trash-outline" size={14} color="#f3f2ff" />
            )}
          </Pressable>
        </View>

        <Pressable
          onPress={() => onOpenDetail(event._id)}
          disabled={isDeleting}
          className="flex-row items-center rounded-xl bg-[#3d29ff] px-4 py-2 active:opacity-80 disabled:opacity-40"
        >
          <Text className="font-manrope-bold text-xs text-white">DETAILS</Text>
          <Ionicons
            name="eye-outline"
            size={13}
            color="#ffffff"
            style={{ marginLeft: 4 }}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default function EventScreen() {
  const router = useRouter();
  const { data, isLoading, isError } = useEvents();
  const deleteEventMutation = useDeleteEvent();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState<EventFilter>("all");
  const deletingEventId = deleteEventMutation.isPending
    ? deleteEventMutation.variables
    : undefined;

  const openDetail = (eventId: string) => {
    router.push({
      pathname: "/(admin)/event/[id]",
      params: { id: eventId },
    });
  };

  const openEdit = (eventId: string) => {
    router.push({
      pathname: "/(admin)/event/[id]",
      params: { id: eventId, mode: "edit" },
    });
  };

  const runDeleteEvent = async (event: Event) => {
    try {
      await deleteEventMutation.mutateAsync(event._id);
      ToastAndroid.show("Event berhasil dihapus.", ToastAndroid.SHORT);
    } catch {
      ToastAndroid.show(
        "Gagal menghapus event. Coba lagi.",
        ToastAndroid.SHORT,
      );
    }
  };

  const confirmDeleteEvent = (event: Event) => {
    if (deleteEventMutation.isPending) {
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
          void runDeleteEvent(event);
        },
      },
    ]);
  };

  const filteredEvents = useMemo(() => {
    const events = data?.data ?? [];
    const keyword = searchKeyword.trim().toLowerCase();

    return events
      .filter((event) => {
        if (activeFilter === "published") {
          return event.isPublish;
        }

        if (activeFilter === "draft") {
          return !event.isPublish;
        }

        if (activeFilter === "featured") {
          return event.isFeatured;
        }

        return true;
      })
      .filter((event) => {
        if (!keyword) {
          return true;
        }

        return event.name.toLowerCase().includes(keyword);
      })
      .sort((left, right) => {
        const leftTime = getEventTimestamp(left.startDate);
        const rightTime = getEventTimestamp(right.startDate);

        if (leftTime === rightTime) {
          return left.name.localeCompare(right.name);
        }

        return leftTime - rightTime;
      });
  }, [activeFilter, data?.data, searchKeyword]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#09071d]">
        <ActivityIndicator size="large" color="#4b30ff" />
      </View>
    );
  }

  if (isError || !data || !data.data) {
    return (
      <View className="flex-1 items-center justify-center bg-[#09071d] px-6">
        <Text className="text-center font-manrope text-[#d6d1ff]">
          Gagal memuat data event
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-[#09071d]">
      <View className="flex-1 bg-[#09071d]">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-4 pb-28"
          showsVerticalScrollIndicator={false}
        >
          <View className="rounded-2xl border border-[#1d1848] bg-[#130d35] px-4 py-3">
            <View className="flex-row items-center">
              <Ionicons name="search" size={18} color="#8f8bb9" />
              <TextInput
                value={searchKeyword}
                onChangeText={setSearchKeyword}
                placeholder="Search events by name..."
                placeholderTextColor="#8f8bb9"
                selectionColor="#6a4fff"
                className="ml-2 flex-1 font-manrope text-base text-[#f1efff]"
              />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="mt-4 pr-2"
          >
            <View className="flex-row items-center">
              {EVENT_FILTERS.map((filterItem) => {
                const isSelected = activeFilter === filterItem.key;

                return (
                  <Pressable
                    key={filterItem.key}
                    onPress={() => setActiveFilter(filterItem.key)}
                    className={`mr-2 rounded-xl px-4 py-2 ${
                      isSelected ? "bg-[#4028ff]" : "bg-[#1a1444]"
                    }`}
                  >
                    <Text
                      className={`font-manrope-semibold text-sm ${
                        isSelected ? "text-white" : "text-[#c7c3ef]"
                      }`}
                    >
                      {filterItem.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <Text
            className="mt-6 font-manrope-bold text-sm text-[#8f8ab7]"
            style={{ letterSpacing: 1.2 }}
          >
            UPCOMING EVENTS
          </Text>

          <View className="mt-3 gap-4">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onOpenDetail={openDetail}
                onOpenEdit={openEdit}
                onDelete={confirmDeleteEvent}
                isDeleting={deletingEventId === event._id}
              />
            ))}
          </View>

          <View className="mt-12 items-center">
            <Ionicons name="clipboard-outline" size={26} color="#716b9f" />
            <Text className="mt-3 font-manrope-medium text-lg text-[#7d78ab]">
              {filteredEvents.length === 0
                ? "No events match your filter"
                : "No more events to show"}
            </Text>
          </View>
        </ScrollView>

        <Pressable
          onPress={() => {
            ToastAndroid.show(
              "Form create event belum tersedia.",
              ToastAndroid.SHORT,
            );
          }}
          disabled={deleteEventMutation.isPending}
          className="absolute bottom-8 right-5 h-14 w-14 items-center justify-center rounded-full bg-[#4a2dfd] active:opacity-80 disabled:opacity-40"
        >
          <Ionicons name="add" size={34} color="#ffffff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
