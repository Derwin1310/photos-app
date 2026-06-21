import { FlashList } from "@shopify/flash-list";
import { Alert, Pressable, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import { Camera, Heart, Pencil, Share2, Trash2, Users } from "lucide-react-native";
import { images } from "@/assets/images";
import { useGallery } from "@/features/gallery/gallery-provider";
import { AppText } from "@/lib/components/app-text";
import { EmptyState } from "@/lib/components/empty-state";
import { ErrorState } from "@/lib/components/error-state";
import type { GalleryPhoto } from "@/lib/types/gallery";
import { formatCompactNumber } from "@/lib/utils/format";

const profileStats = [
  { icon: Camera, label: "Photos" },
  { icon: Heart, label: "Likes" },
  { icon: Users, label: "Followers" },
] as const;

export default function ProfileScreen() {
  const { deletePhoto, error, hydrated, photos } = useGallery();

  async function sharePhoto(uri: string) {
    try {
      const canShare = await Sharing.isAvailableAsync();

      if (!canShare) {
        Alert.alert("Sharing unavailable", "This device cannot share photos.");
        return;
      }

      await Sharing.shareAsync(uri);
    } catch (shareError) {
      Alert.alert(
        "Share failed",
        shareError instanceof Error ? shareError.message : "Could not share that photo.",
      );
    }
  }

  async function confirmDelete(photoId: string) {
    Alert.alert("Delete photo?", "This will remove it from your local gallery.", [
      { style: "cancel", text: "Keep it" },
      {
        style: "destructive",
        text: "Delete",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
            () => undefined,
          );
          void deletePhoto(photoId);
        },
      },
    ]);
  }

  const statValues = {
    Followers: 128,
    Likes: photos.length * 4,
    Photos: photos.length,
  } as const;

  if (!hydrated) {
    return (
      <View className="flex-1 justify-center px-5">
        <AppText center tone="muted">
          Loading your gallery...
        </AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center px-5">
        <ErrorState message={error} />
      </View>
    );
  }

  return (
    <FlashList<GalleryPhoto>
      ListHeaderComponent={
        <View className="gap-6 px-5 pb-5 pt-6">
          <View className="gap-5 rounded-[32px] bg-surface px-5 py-5">
            <View className="flex-row items-center gap-4">
              <Image
                className="h-24 w-24 rounded-full bg-canvas"
                contentFit="cover"
                source={images.ownerProfile}
              />
              <View className="flex-1 gap-1">
                <AppText variant="headline">Lina Rios</AppText>
                <AppText tone="muted">@lina_rios</AppText>
                <AppText tone="muted">
                  Photo journaler collecting city moments one frame at a time.
                </AppText>
              </View>
            </View>

            <View className="flex-row justify-between gap-3">
              {profileStats.map(({ icon: Icon, label }) => (
                <View
                  key={label}
                  className="flex-1 rounded-[24px] bg-canvas px-4 py-4"
                >
                  <Icon color="#ab7e57" size={22} strokeWidth={2.2} />
                  <AppText className="mt-3" variant="subheading">
                    {formatCompactNumber(statValues[label])}
                  </AppText>
                  <AppText tone="muted" variant="caption">
                    {label}
                  </AppText>
                </View>
              ))}
            </View>
          </View>

          <View className="gap-1">
            <AppText variant="headline">My photos</AppText>
            <AppText tone="muted">
              Captures saved from the camera tab live here automatically.
            </AppText>
          </View>
        </View>
      }
      className="flex-1 bg-canvas"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ gap: 16, paddingBottom: 40, paddingHorizontal: 20 }}
      data={photos}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <EmptyState
          message="Capture something from the camera tab and it will show up here with edit, share, and delete actions."
          title="Your gallery is empty"
        />
      }
      renderItem={({ item }) => (
        <View className="gap-4 rounded-[28px] bg-surface p-4">
          <View className="flex-row gap-4">
            <Image
              className="h-24 w-24 rounded-[20px] bg-canvas"
              contentFit="cover"
              source={{ uri: item.uri }}
              transition={180}
            />
            <View className="flex-1 justify-between gap-3">
              <View>
                <AppText variant="subheading">
                  {item.caption || "Untitled memory"}
                </AppText>
                <AppText tone="muted" variant="caption">
                  Updated {new Date(item.updatedAt).toLocaleDateString()}
                </AppText>
              </View>
              <View className="flex-row flex-wrap gap-2">
                <Pressable
                  accessibilityLabel="Share photo"
                  className="rounded-full bg-canvas px-3 py-2"
                  onPress={() => void sharePhoto(item.uri)}
                >
                  <View className="flex-row items-center gap-2">
                    <Share2 color="#3a3636" size={18} strokeWidth={2.2} />
                    <AppText variant="caption">Share</AppText>
                  </View>
                </Pressable>
                <Pressable
                  accessibilityLabel="Edit caption"
                  className="rounded-full bg-canvas px-3 py-2"
                  onPress={() =>
                    router.push({
                      pathname: "/(modals)/edit-photo",
                      params: { photoId: item.id },
                    })
                  }
                >
                  <View className="flex-row items-center gap-2">
                    <Pencil color="#3a3636" size={18} strokeWidth={2.2} />
                    <AppText variant="caption">Edit</AppText>
                  </View>
                </Pressable>
                <Pressable
                  accessibilityLabel="Delete photo"
                  className="rounded-full bg-canvas px-3 py-2"
                  onPress={() => void confirmDelete(item.id)}
                >
                  <View className="flex-row items-center gap-2">
                    <Trash2 color="#b55151" size={18} strokeWidth={2.2} />
                    <AppText tone="danger" variant="caption">
                      Delete
                    </AppText>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}
