import type React from "react";
import { FlashList } from "@shopify/flash-list";
import { Alert, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import { Camera, MessageCircle, Pencil, Share2, Trash2 } from "lucide-react-native";
import Animated from "react-native-reanimated";
import { images } from "@/assets/images";
import { useGallery } from "@/features/gallery/gallery-provider";
import { AppText } from "@/lib/components/app-text";
import { AppButton } from "@/lib/components/app-button";
import { EmptyState } from "@/lib/components/empty-state";
import { ErrorState } from "@/lib/components/error-state";
import { LoadingState } from "@/lib/components/loading-state";
import { SectionHeader } from "@/lib/components/section-header";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import type { GalleryPhoto } from "@/lib/types/gallery";
import { formatCompactNumber, formatGalleryDate } from "@/lib/utils/format";
import { styles } from "./profile-screen.styles";

const AnimatedView = Animated.View;
const StyledImage = withUnistyles(Image);
const StyledFlashList = withUnistyles(FlashList) as typeof FlashList;

const profileStats = [
  { icon: Camera, label: "Photos" },
  { icon: MessageCircle, label: "Captions" },
  { icon: Share2, label: "Shareable" },
] as const;

type GalleryPhotoCardProps = {
  confirmDelete: (photo: GalleryPhoto) => void;
  index: number;
  item: GalleryPhoto;
  sharePhoto: (uri: string) => void;
};

const GalleryPhotoCard: React.FC<GalleryPhotoCardProps> = ({
  confirmDelete,
  index,
  item,
  sharePhoto,
}) => {
  const entranceStyle = useEntranceAnimation({
    delay: Math.min(index, 6) * 34,
    distance: 14,
  });

  return (
    <AnimatedView style={[styles.card, entranceStyle]}>
      <View style={styles.photoRow}>
        <StyledImage
          contentFit="cover"
          source={{ uri: item.uri }}
          style={styles.image}
          transition={180}
        />
        <View style={styles.info}>
          <View>
            <AppText variant="title">
              {item.caption || "Untitled memory"}
            </AppText>
            <AppText tone="muted" variant="bodySmall">
              Updated {formatGalleryDate(item.updatedAt)}
            </AppText>
          </View>
          <View style={styles.actions}>
            <AppButton icon={Share2} label="Share" onPress={() => void sharePhoto(item.uri)} size="sm" variant="secondary" />
            <AppButton
              icon={Pencil}
              label="Edit"
              onPress={() =>
                router.push({
                  pathname: "/(modals)/edit-photo",
                  params: { photoId: item.id },
                })
              }
              size="sm"
              variant="secondary"
            />
            <AppButton icon={Trash2} label="Delete" onPress={() => void confirmDelete(item)} size="sm" variant="destructive" />
          </View>
        </View>
      </View>
    </AnimatedView>
  );
};

type GalleryListHeaderProps = {
  photos: GalleryPhoto[];
};

const GalleryListHeader: React.FC<GalleryListHeaderProps> = ({ photos }) => {
  const { theme } = useUnistyles();

  const statValues = {
    Captions: photos.filter((photo) => photo.caption.trim().length > 0).length,
    Photos: photos.length,
    Shareable: photos.length,
  } as const;

  const headerEntranceStyle = useEntranceAnimation({ distance: 12 });

  return (
    <AnimatedView style={[styles.header, headerEntranceStyle]}>
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
            <AppText tone="muted" variant="bodySmall">
              Photo journaler building a share-ready collection from saved captures.
            </AppText>
          </View>
        </View>

        <View style={styles.statRow}>
          {profileStats.map(({ icon: Icon, label }, index) => (
            <View
              key={label}
              style={styles.stat(index)}
            >
              <Icon
                color={
                  index === 0
                    ? theme.colors.accent
                    : index === 1
                      ? theme.colors.accentSecondary
                      : theme.colors.accentTertiary
                }
                size={theme.size.iconMd}
                strokeWidth={2.2}
              />
              <AppText style={styles.statValue} variant="title">
                {formatCompactNumber(statValues[label])}
              </AppText>
              <AppText tone="muted" variant="bodySmall">
                {label}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <SectionHeader
        subtitle="Your camera saves, captions, and share-ready memories live here."
        title="Saved captures"
      />
    </AnimatedView>
  );
};

const ProfileScreen: React.FC = () => {
  const { deletePhoto, error, hydrated, photos, restorePhoto } = useGallery();

  const sharePhoto = async (uri: string) => {
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
  };

  const confirmDelete = async (photo: GalleryPhoto) => {
    Alert.alert("Delete photo?", "This will remove it from your local gallery.", [
      { style: "cancel", text: "Keep it" },
      {
        style: "destructive",
        text: "Delete",
        onPress: async () => {
          try {
            await deletePhoto(photo.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
              () => undefined,
            );
            Alert.alert("Photo deleted", "You can restore it if that was a mistake.", [
              { style: "cancel", text: "Done" },
              {
                text: "Undo",
                onPress: () => {
                  restorePhoto(photo)
                    .then(() =>
                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success,
                      ),
                    )
                    .catch((restoreError) => {
                      Alert.alert(
                        "Restore failed",
                        restoreError instanceof Error
                          ? restoreError.message
                          : "Could not restore that photo.",
                      );
                    });
                },
              },
            ]);
          } catch (deleteError) {
            Alert.alert(
              "Delete failed",
              deleteError instanceof Error
                ? deleteError.message
                : "Could not delete that photo.",
            );
          }
        },
      },
    ]);
  };

  if (!hydrated) {
    return (
      <View style={styles.centered}>
        <LoadingState message="Loading your saved captures..." />
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
    <StyledFlashList<GalleryPhoto>
      ListHeaderComponent={<GalleryListHeader photos={photos} />}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      data={photos}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <EmptyState
          message="Capture something from the camera tab and it will show up here with edit, share, and delete actions."
          title="Your profile is waiting for its first capture"
        />
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ index, item }) => (
        <GalleryPhotoCard
          confirmDelete={(photo) => void confirmDelete(photo)}
          index={index}
          item={item}
          sharePhoto={(uri) => void sharePhoto(uri)}
        />
      )}
      showsVerticalScrollIndicator={false}
      style={styles.list}
    />
  );
};

export default ProfileScreen;
