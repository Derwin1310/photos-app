import type React from "react";
import { FlashList } from "@shopify/flash-list";
import { Alert, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import { Camera, LogOut, MessageCircle, Pencil, Share2, Trash2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { images } from "@/assets/images";
import { useAuth, type AuthUser } from "@/features/auth/auth-provider";
import { useGallery } from "@/features/gallery/gallery-provider";
import { AppText } from "@/lib/components/app-text";
import { AppButton } from "@/lib/components/app-button";
import { IconButton } from "@/lib/components/icon-button";
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
  { icon: Camera, labelKey: "gallery.captures", value: "captures" },
  { icon: MessageCircle, labelKey: "gallery.captioned", value: "captioned" },
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
  const { t } = useTranslation();
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
              {item.caption || t("gallery.untitledMemory")}
            </AppText>
            <AppText tone="muted" variant="bodySmall">
              {t("gallery.updatedDate", { date: formatGalleryDate(item.updatedAt) })}
            </AppText>
          </View>
          <View style={styles.actions}>
            <AppButton
              icon={Pencil}
              label={t("common.edit")}
              onPress={() =>
                router.push({
                  pathname: "/(modals)/edit-photo",
                  params: { photoId: item.id },
                })
              }
              size="sm"
              variant="secondary"
            />
            <IconButton
              icon={Share2}
              label={t("gallery.sharePhoto")}
              onPress={() => void sharePhoto(item.uri)}
              size="sm"
              variant="surface"
            />
            <IconButton
              icon={Trash2}
              label={t("gallery.deletePhoto")}
              onPress={() => void confirmDelete(item)}
              size="sm"
              variant="danger"
            />
          </View>
        </View>
      </View>
    </AnimatedView>
  );
};

type GalleryListHeaderProps = {
  isSigningOut: boolean;
  onLogout: () => void;
  photos: GalleryPhoto[];
  user: AuthUser | null;
};

const GalleryListHeader: React.FC<GalleryListHeaderProps> = ({
  isSigningOut,
  onLogout,
  photos,
  user,
}) => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  const statValues = {
    captioned: photos.filter((photo) => photo.caption.trim().length > 0).length,
    captures: photos.length,
  } as const;

  const headerEntranceStyle = useEntranceAnimation({ distance: 12 });

  return (
    <AnimatedView style={[styles.header, headerEntranceStyle]}>
      <View style={styles.accountPanel}>
        <View style={styles.accountCopy}>
          <AppText variant="title">{t("gallery.accountTitle")}</AppText>
          <AppText numberOfLines={1} tone="muted" variant="bodySmall">
            {user?.email ?? t("gallery.fallbackEmail")}
          </AppText>
        </View>
        <AppButton
          accessibilityState={{ busy: isSigningOut, disabled: isSigningOut }}
          disabled={isSigningOut}
          icon={LogOut}
          label={isSigningOut ? t("gallery.signingOut") : t("gallery.logout")}
          onPress={onLogout}
          size="sm"
          variant="tertiary"
        />
      </View>
    
      <View style={styles.profileCard}>
        <View style={styles.profileRow}>
          <StyledImage
            contentFit="cover"
            source={user?.picture ? { uri: user.picture } : images.profileFallback}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <AppText numberOfLines={1} variant="headline">
              {user?.name ?? t("gallery.fallbackName")}
            </AppText>
            <AppText tone="muted" variant="bodySmall">
              {t("gallery.profileSubtitle")}
            </AppText>
          </View>
        </View>

        <View style={styles.statRow}>
          {profileStats.map(({ icon: Icon, labelKey, value }, index) => (
            <View
              key={labelKey}
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
                {formatCompactNumber(statValues[value])}
              </AppText>
              <AppText tone="muted" variant="bodySmall">
                {t(labelKey)}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <SectionHeader
        subtitle={t("gallery.savedCapturesSubtitle")}
        title={t("gallery.savedCapturesTitle")}
      />
    </AnimatedView>
  );
};

const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isSigningOut, signOut, user } = useAuth();
  const { deletePhoto, error, hydrated, photos, restorePhoto } = useGallery();

  const sharePhoto = async (uri: string) => {
    try {
      const canShare = await Sharing.isAvailableAsync();

      if (!canShare) {
        Alert.alert(
          t("gallery.sharingUnavailableTitle"),
          t("gallery.sharingUnavailableMessage"),
        );
        return;
      }

      await Sharing.shareAsync(uri);
    } catch (shareError) {
      Alert.alert(
        t("gallery.shareFailed"),
        shareError instanceof Error ? shareError.message : t("gallery.couldNotShare"),
      );
    }
  };

  const confirmDelete = async (photo: GalleryPhoto) => {
    Alert.alert(t("gallery.deleteTitle"), t("gallery.deleteMessage"), [
      { style: "cancel", text: t("gallery.keepIt") },
      {
        style: "destructive",
        text: t("common.delete"),
        onPress: async () => {
          try {
            await deletePhoto(photo.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
              () => undefined,
            );
            Alert.alert(t("gallery.deletedTitle"), t("gallery.deletedMessage"), [
              { style: "cancel", text: t("common.done") },
              {
                text: t("gallery.undo"),
                onPress: () => {
                  restorePhoto(photo)
                    .then(() =>
                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success,
                      ),
                    )
                    .catch((restoreError) => {
                      Alert.alert(
                        t("gallery.restoreFailed"),
                        restoreError instanceof Error
                          ? restoreError.message
                          : t("gallery.couldNotRestore"),
                      );
                    });
                },
              },
            ]);
          } catch (deleteError) {
            Alert.alert(
              t("gallery.deleteFailed"),
              deleteError instanceof Error
                ? deleteError.message
                : t("gallery.couldNotDelete"),
            );
          }
        },
      },
    ]);
  };

  if (!hydrated) {
    return (
      <View style={styles.centered}>
        <LoadingState message={t("gallery.loading")} />
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
      ListHeaderComponent={
        <GalleryListHeader
          isSigningOut={isSigningOut}
          onLogout={() => void signOut()}
          photos={photos}
          user={user}
        />
      }
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      data={photos}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <EmptyState
          message={t("gallery.emptyMessage")}
          title={t("gallery.emptyTitle")}
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
