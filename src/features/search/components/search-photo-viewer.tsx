import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Download, X } from "lucide-react-native";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import { AppIcon } from "@/lib/components/app-icon";
import { AppText } from "@/lib/components/app-text";
import { usePhotoDownload } from "@/lib/hooks/use-photo-download";
import type { UnsplashPhoto } from "@/lib/types/photos";
import { styles } from "./search-photo-viewer.styles";

const StyledImage = withUnistyles(Image);

type SearchPhotoViewerProps = {
  initialIndex: number;
  onClose: () => void;
  photos: UnsplashPhoto[];
  visible: boolean;
};

const getPhotoLabel = (photo: UnsplashPhoto) =>
  photo.altDescription ??
  photo.description ??
  `Photo by ${photo.photographer.name}`;

export const SearchPhotoViewer: React.FC<SearchPhotoViewerProps> = ({
  initialIndex,
  onClose,
  photos,
  visible,
}) => {
  const { width } = useWindowDimensions();
  const { theme } = useUnistyles();
  const listRef = useRef<FlatList<UnsplashPhoto>>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const { downloadingPhotoId, downloadPhoto } = usePhotoDownload();
  const currentPhoto = photos[currentIndex];
  const isDownloading = currentPhoto ? downloadingPhotoId === currentPhoto.id : false;

  useEffect(() => {
    if (!visible) {
      return;
    }

    setCurrentIndex(initialIndex);
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        animated: false,
        index: initialIndex,
      });
    });
  }, [initialIndex, visible]);

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(Math.max(0, Math.min(nextIndex, photos.length - 1)));
  };

  const handleDownload = () => {
    if (!currentPhoto) {
      return;
    }

    void downloadPhoto(currentPhoto);
  };

  return (
    <Modal animationType="fade" onRequestClose={onClose} visible={visible}>
      <View style={styles.root}>
        <FlatList
          ref={listRef}
          data={photos}
          getItemLayout={(_, index) => ({
            index,
            length: width,
            offset: width * index,
          })}
          horizontal
          initialScrollIndex={initialIndex}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onScrollToIndexFailed={({ index }) => {
            requestAnimationFrame(() => {
              listRef.current?.scrollToIndex({ animated: false, index });
            });
          }}
          pagingEnabled
          renderItem={({ item }) => (
            <View style={styles.page(width)}>
              <StyledImage
                accessibilityLabel={getPhotoLabel(item)}
                contentFit="contain"
                recyclingKey={`${item.id}-viewer`}
                source={{ uri: item.imageUrl }}
                style={styles.image}
                transition={180}
              />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />

        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="Close full screen image viewer"
            accessibilityRole="button"
            hitSlop={10}
            onPress={onClose}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressed,
            ]}
          >
            <AppIcon color={theme.colors.textInverse} icon={X} size={theme.size.iconMd} />
          </Pressable>
        </View>

        <View style={styles.bottomBar}>
          <View style={styles.viewerDetails}>
            <AppText numberOfLines={1} style={styles.viewerTitle} variant="title">
              {currentPhoto?.photographer.name ?? "Unsplash photo"}
            </AppText>
            <AppText numberOfLines={1} style={styles.viewerSubtitle} variant="bodySmall">
              {currentIndex + 1} of {photos.length}
            </AppText>
          </View>
          <Pressable
            accessibilityLabel="Save image to device"
            accessibilityRole="button"
            accessibilityState={{ busy: isDownloading, disabled: isDownloading }}
            disabled={isDownloading || !currentPhoto}
            hitSlop={8}
            onPress={handleDownload}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.pressed,
              isDownloading && styles.disabled,
            ]}
          >
            {isDownloading ? (
              <ActivityIndicator color={theme.colors.text} size="small" />
            ) : (
              <AppIcon color={theme.colors.text} icon={Download} size={theme.size.iconSm} />
            )}
            <AppText style={styles.saveButtonLabel} variant="bodySmall">
              {isDownloading ? "Saving" : "Save"}
            </AppText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
