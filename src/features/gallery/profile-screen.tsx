import type React from "react";
import { useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { Alert, Pressable, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { withUnistyles } from "react-native-unistyles";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import {
  Download,
  HeartOff,
  LogOut,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { images } from "@/assets/images";
import { useAuth, type AuthUser } from "@/features/auth/auth-provider";
import { useGallery } from "@/features/gallery/gallery-provider";
import { useLikedPhotos } from "@/features/likes/liked-photos-provider";
import type { LikedPhoto } from "@/features/likes/liked-photos-repository";
import { AppText } from "@/lib/components/app-text";
import { AppButton } from "@/lib/components/app-button";
import { IconButton } from "@/lib/components/icon-button";
import { EmptyState } from "@/lib/components/empty-state";
import { ErrorState } from "@/lib/components/error-state";
import { LoadingState } from "@/lib/components/loading-state";
import { SectionHeader } from "@/lib/components/section-header";
import { usePhotoDownload } from "@/lib/hooks/use-photo-download";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import type { GalleryPhoto } from "@/lib/types/gallery";
import { formatCompactNumber, formatGalleryDate } from "@/lib/utils/format";
import { styles } from "./profile-screen.styles";

const AnimatedView = Animated.View;
const StyledImage = withUnistyles(Image);
const StyledFlashList = withUnistyles(FlashList) as typeof FlashList;

type ProfileTab = "captures" | "liked";

type LikedPhotoGridRow = {
  id: string;
  photos: LikedPhoto[];
  type: "liked-row";
};

type ProfileListItem = GalleryPhoto | LikedPhotoGridRow;

const profileTabs = [
  { labelKey: "gallery.captures", value: "captures" },
  { labelKey: "likes.tab", value: "liked" },
] as const;

const buildLikedPhotoRows = (photos: LikedPhoto[]): LikedPhotoGridRow[] => {
  const rows: LikedPhotoGridRow[] = [];

  for (let index = 0; index < photos.length; index += 2) {
    const rowPhotos = photos.slice(index, index + 2);

    rows.push({
      id: `liked-row-${rowPhotos.map((photo) => photo.id).join("-")}`,
      photos: rowPhotos,
      type: "liked-row",
    });
  }

  return rows;
};

const isLikedPhotoGridRow = (item: ProfileListItem): item is LikedPhotoGridRow =>
  "type" in item && item.type === "liked-row";

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

type LikedPhotoCardProps = {
  columnIndex: number;
  index: number;
  isDownloading: boolean;
  item: LikedPhoto;
  onRemove: (photo: LikedPhoto) => void;
  onSave: (photo: LikedPhoto) => void;
};

const LikedPhotoCard: React.FC<LikedPhotoCardProps> = ({
  columnIndex,
  index,
  isDownloading,
  item,
  onRemove,
  onSave,
}) => {
  const { t } = useTranslation();
  const entranceStyle = useEntranceAnimation({
    delay: Math.min(index, 6) * 34,
    distance: 14,
  });

  return (
    <AnimatedView style={[styles.likedCard(columnIndex), entranceStyle]}>
      <View style={styles.likedImageFrame}>
        <StyledImage
          contentFit="cover"
          recyclingKey={`${item.id}-liked-profile`}
          source={{ uri: item.thumbUrl }}
          style={styles.likedImage}
          transition={180}
        />
      </View>
      <View style={styles.likedCardCopy}>
        <AppText numberOfLines={1} variant="title">
          {item.photographer.name || t("feed.anonymous")}
        </AppText>
        <AppText numberOfLines={2} tone="muted" variant="bodySmall">
          {item.description || item.altDescription || t("feed.noCaption")}
        </AppText>
        <AppText tone="muted" variant="bodySmall">
          {t("likes.likedDate", { date: formatGalleryDate(item.likedAt) })}
        </AppText>
        <View style={styles.likedActions}>
          <AppButton
            accessibilityState={{ busy: isDownloading, disabled: isDownloading }}
            disabled={isDownloading}
            icon={Download}
            label={isDownloading ? t("common.saving") : t("likes.saveToDevice")}
            onPress={() => onSave(item)}
            size="sm"
            variant="secondary"
          />
          <AppButton
            fullWidth
            icon={HeartOff}
            label={t("likes.unlike")}
            onPress={() => onRemove(item)}
            size="sm"
            variant="tertiary"
          />
        </View>
      </View>
    </AnimatedView>
  );
};

type ProfileSegmentedControlProps = {
  activeTab: ProfileTab;
  capturesCount: number;
  likedCount: number;
  onChange: (tab: ProfileTab) => void;
};

const ProfileSegmentedControl: React.FC<ProfileSegmentedControlProps> = ({
  activeTab,
  capturesCount,
  likedCount,
  onChange,
}) => {
  const { t } = useTranslation();
  const counts = {
    captures: capturesCount,
    liked: likedCount,
  } as const;

  return (
    <View accessibilityRole="tablist" style={styles.segmentedControl}>
      {profileTabs.map((tab) => {
        const selected = activeTab === tab.value;

        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={tab.value}
            onPress={() => onChange(tab.value)}
            style={({ pressed }) => [
              styles.segmentedOption(selected),
              pressed && styles.segmentedOptionPressed,
            ]}
          >
            <View style={styles.segmentedOptionContent}>
              <AppText style={styles.segmentedOptionText(selected)} variant="bodySmall">
                {t(tab.labelKey)}
              </AppText>
              <AppText style={styles.segmentedBadge(selected)} variant="bodySmall">
                {formatCompactNumber(counts[tab.value])}
              </AppText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

type RestoreLikedPhotoNoticeProps = {
  onRestore: () => void;
  photo: LikedPhoto;
};

const RestoreLikedPhotoNotice: React.FC<RestoreLikedPhotoNoticeProps> = ({
  onRestore,
  photo,
}) => {
  const { t } = useTranslation();
  const entranceStyle = useEntranceAnimation({ distance: 8 });

  return (
    <AnimatedView
      accessibilityLiveRegion="polite"
      style={[styles.restoreNotice, entranceStyle]}
    >
      <View style={styles.restoreCopy}>
        <AppText numberOfLines={1} variant="title">
          {t("likes.removedTitle")}
        </AppText>
        <AppText numberOfLines={1} tone="muted" variant="bodySmall">
          {t("likes.removedMessage", {
            name: photo.photographer.name || t("feed.anonymous"),
          })}
        </AppText>
      </View>
      <AppButton
        label={t("gallery.undo")}
        onPress={onRestore}
        size="sm"
        variant="secondary"
      />
    </AnimatedView>
  );
};

type GalleryListHeaderProps = {
  activeTab: ProfileTab;
  isSigningOut: boolean;
  likedPhotos: LikedPhoto[];
  recentlyRemovedPhoto: LikedPhoto | null;
  onRestoreLike: () => void;
  onTabChange: (tab: ProfileTab) => void;
  onLogout: () => void;
  photos: GalleryPhoto[];
  user: AuthUser | null;
};

const GalleryListHeader: React.FC<GalleryListHeaderProps> = ({
  activeTab,
  isSigningOut,
  likedPhotos,
  recentlyRemovedPhoto,
  onRestoreLike,
  onTabChange,
  onLogout,
  photos,
  user,
}) => {
  const { t } = useTranslation();
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
      </View>

      <ProfileSegmentedControl
        activeTab={activeTab}
        capturesCount={photos.length}
        likedCount={likedPhotos.length}
        onChange={onTabChange}
      />
      <SectionHeader
        subtitle={
          activeTab === "captures"
            ? t("gallery.savedCapturesSubtitle")
            : t("likes.profileSubtitle")
        }
        title={activeTab === "captures" ? t("gallery.savedCapturesTitle") : t("likes.title")}
      />
      {activeTab === "liked" && recentlyRemovedPhoto ? (
        <RestoreLikedPhotoNotice
          onRestore={onRestoreLike}
          photo={recentlyRemovedPhoto}
        />
      ) : null}
    </AnimatedView>
  );
};

const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("captures");
  const [recentlyRemovedPhoto, setRecentlyRemovedPhoto] = useState<LikedPhoto | null>(null);
  const { t } = useTranslation();
  const { isSigningOut, signOut, user } = useAuth();
  const { deletePhoto, error, hydrated, photos, restorePhoto } = useGallery();
  const {
    error: likedPhotosError,
    hydrated: likedPhotosHydrated,
    likePhoto,
    photos: likedPhotos,
    unlikePhoto,
  } = useLikedPhotos();
  const { downloadingPhotoId, downloadPhoto } = usePhotoDownload();

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

  const removeLikedPhoto = (photo: LikedPhoto) => {
    setRecentlyRemovedPhoto(photo);
    void unlikePhoto(photo.id)
      .then(() => {
        Haptics.selectionAsync().catch(() => undefined);
      })
      .catch((removeError) => {
        setRecentlyRemovedPhoto(null);
        Alert.alert(
          t("likes.couldNotRemove"),
          removeError instanceof Error ? removeError.message : t("errors.generic"),
        );
      });
  };

  const restoreRecentlyRemovedPhoto = () => {
    if (!recentlyRemovedPhoto) {
      return;
    }

    const photoToRestore = recentlyRemovedPhoto;

    setRecentlyRemovedPhoto(null);
    void likePhoto(photoToRestore).catch((restoreError) => {
      setRecentlyRemovedPhoto(photoToRestore);
      Alert.alert(
        t("likes.couldNotSave"),
        restoreError instanceof Error ? restoreError.message : t("errors.generic"),
      );
    });
  };

  const listData: ProfileListItem[] =
    activeTab === "captures" ? photos : buildLikedPhotoRows(likedPhotos);
  const listError = error ?? likedPhotosError;

  if (!hydrated || !likedPhotosHydrated) {
    return (
      <View style={styles.centered}>
        <LoadingState message={t("gallery.loading")} />
      </View>
    );
  }

  if (listError) {
    return (
      <View style={styles.centered}>
        <ErrorState message={listError} />
      </View>
    );
  }

  return (
    <StyledFlashList<ProfileListItem>
      ListHeaderComponent={
        <GalleryListHeader
          activeTab={activeTab}
          isSigningOut={isSigningOut}
          likedPhotos={likedPhotos}
          recentlyRemovedPhoto={recentlyRemovedPhoto}
          onRestoreLike={restoreRecentlyRemovedPhoto}
          onTabChange={setActiveTab}
          onLogout={() => void signOut()}
          photos={photos}
          user={user}
        />
      }
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      data={listData}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        activeTab === "captures" ? (
          <EmptyState
            message={t("gallery.emptyMessage")}
            title={t("gallery.emptyTitle")}
          />
        ) : (
          <EmptyState
            message={t("likes.emptyMessage")}
            title={t("likes.emptyTitle")}
          />
        )
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ index, item }) =>
        isLikedPhotoGridRow(item) ? (
          <View style={styles.likedGridRow}>
            {item.photos.map((photo, columnIndex) => (
              <LikedPhotoCard
                columnIndex={columnIndex}
                index={index * 2 + columnIndex}
                isDownloading={downloadingPhotoId === photo.id}
                item={photo}
                key={photo.id}
                onRemove={removeLikedPhoto}
                onSave={(likedPhoto) => void downloadPhoto(likedPhoto)}
              />
            ))}
            {item.photos.length === 1 ? <View style={styles.likedGridSpacer} /> : null}
          </View>
        ) : (
          <GalleryPhotoCard
            confirmDelete={(photo) => void confirmDelete(photo)}
            index={index}
            item={item}
            sharePhoto={(uri) => void sharePhoto(uri)}
          />
        )
      }
      showsVerticalScrollIndicator={false}
      style={styles.list}
    />
  );
};

export default ProfileScreen;
