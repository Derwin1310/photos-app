import { FlashList } from "@shopify/flash-list";
import { Alert, Pressable, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import { Camera, Heart, Pencil, Share2, Trash2, Users } from "lucide-react-native";
import { images } from "@/assets/images";
import { useGallery } from "@/features/gallery/gallery-provider";
import { AppText } from "@/lib/components/app-text";
import { EmptyState } from "@/lib/components/empty-state";
import { ErrorState } from "@/lib/components/error-state";
import type { GalleryPhoto } from "@/lib/types/gallery";
import { formatCompactNumber, formatGalleryDate } from "@/lib/utils/format";
import { styles } from "./profile-screen.styles";

const StyledImage = withUnistyles(Image);

const profileStats = [
  { icon: Camera, label: "Photos" },
  { icon: Heart, label: "Likes" },
  { icon: Users, label: "Followers" },
] as const;

export default function ProfileScreen() {
  const { deletePhoto, error, hydrated, photos } = useGallery();
  const { theme } = useUnistyles();

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
      <View style={styles.centered}>
        <AppText center tone="muted">
          Loading your gallery...
        </AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <ErrorState message={error} />
      </View>
    );
  }

  return (
    <FlashList<GalleryPhoto>
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <StyledImage
                contentFit="cover"
                source={images.ownerProfile}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <AppText variant="headline">Lina Rios</AppText>
                <AppText tone="muted">@lina_rios</AppText>
                <AppText tone="muted">
                  Photo journaler collecting city moments one frame at a time.
                </AppText>
              </View>
            </View>

            <View style={styles.statRow}>
              {profileStats.map(({ icon: Icon, label }) => (
                <View
                  key={label}
                  style={styles.stat}
                >
                  <Icon color={theme.colors.accent} size={22} strokeWidth={2.2} />
                  <AppText style={styles.statValue} variant="subheading">
                    {formatCompactNumber(statValues[label])}
                  </AppText>
                  <AppText tone="muted" variant="caption">
                    {label}
                  </AppText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <AppText variant="headline">My photos</AppText>
            <AppText tone="muted">
              Captures saved from the camera tab live here automatically.
            </AppText>
          </View>
        </View>
      }
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      data={photos}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <EmptyState
          message="Capture something from the camera tab and it will show up here with edit, share, and delete actions."
          title="Your gallery is empty"
        />
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.photoRow}>
            <StyledImage
              contentFit="cover"
              source={{ uri: item.uri }}
              style={styles.image}
              transition={180}
            />
            <View style={styles.info}>
              <View>
                <AppText variant="subheading">
                  {item.caption || "Untitled memory"}
                </AppText>
                <AppText tone="muted" variant="caption">
                  Updated {formatGalleryDate(item.updatedAt)}
                </AppText>
              </View>
              <View style={styles.actions}>
                <Pressable
                  accessibilityLabel="Share photo"
                  onPress={() => void sharePhoto(item.uri)}
                  style={styles.action}
                >
                  <View style={styles.actionRow}>
                    <Share2 color={theme.colors.ink} size={18} strokeWidth={2.2} />
                    <AppText variant="caption">Share</AppText>
                  </View>
                </Pressable>
                <Pressable
                  accessibilityLabel="Edit caption"
                  onPress={() =>
                    router.push({
                      pathname: "/(modals)/edit-photo",
                      params: { photoId: item.id },
                    })
                  }
                  style={styles.action}
                >
                  <View style={styles.actionRow}>
                    <Pencil color={theme.colors.ink} size={18} strokeWidth={2.2} />
                    <AppText variant="caption">Edit</AppText>
                  </View>
                </Pressable>
                <Pressable
                  accessibilityLabel="Delete photo"
                  onPress={() => void confirmDelete(item.id)}
                  style={styles.action}
                >
                  <View style={styles.actionRow}>
                    <Trash2 color={theme.colors.danger} size={18} strokeWidth={2.2} />
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
      style={styles.list}
    />
  );
}
