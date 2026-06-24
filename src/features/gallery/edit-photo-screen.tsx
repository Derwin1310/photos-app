import { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import { useGallery } from "@/features/gallery/gallery-provider";
import { AppText } from "@/lib/components/app-text";
import { ErrorState } from "@/lib/components/error-state";
import { styles } from "./edit-photo-screen.styles";

const StyledImage = withUnistyles(Image);

export default function EditPhotoScreen() {
  const params = useLocalSearchParams<{ mode?: string; photoId?: string }>();
  const {
    addPhoto,
    clearDraftPhoto,
    draftPhoto,
    getPhoto,
    updateDraftCaption,
    updatePhoto,
  } = useGallery();
  const isDraftMode = params.mode === "draft";
  const photo = params.photoId ? getPhoto(params.photoId) : undefined;
  const sourcePhoto = isDraftMode ? draftPhoto : photo;
  const [caption, setCaption] = useState(sourcePhoto?.caption ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useUnistyles();

  useEffect(() => {
    setCaption(sourcePhoto?.caption ?? "");
  }, [sourcePhoto?.caption]);

  function handleCaptionChange(nextCaption: string) {
    setCaption(nextCaption);

    if (isDraftMode) {
      updateDraftCaption(nextCaption);
    }
  }

  if (!sourcePhoto) {
    return (
      <View style={styles.screen}>
        <ErrorState
          message={
            isDraftMode
              ? "There is no captured draft waiting for a caption."
              : "That photo could not be found in your gallery."
          }
        />
      </View>
    );
  }

  async function saveChanges() {
    if (!sourcePhoto) {
      return;
    }

    Keyboard.dismiss();
    setIsSaving(true);
    setError(null);

    try {
      if (isDraftMode) {
        const mediaPermission = await MediaLibrary.requestPermissionsAsync();

        if (!mediaPermission.granted) {
          throw new Error("Media library permission is required to save photos.");
        }

        await MediaLibrary.Asset.create(sourcePhoto.uri);
        await addPhoto(sourcePhoto.uri, caption);
        clearDraftPhoto();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
          () => undefined,
        );
      } else {
        if (!photo) {
          throw new Error("That photo could not be found in your gallery.");
        }

        await updatePhoto(photo.id, caption);
      }

      router.back();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : isDraftMode
            ? "Could not save this photo."
            : "Could not save the new caption.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", default: "height" })}
      style={styles.root}
    >
      <Stack.Screen options={{ title: isDraftMode ? "Caption photo" : "Edit photo" }} />
      <Pressable
        onPress={Keyboard.dismiss}
        style={styles.screen}
      >
        <View style={styles.card}>
          <StyledImage
            contentFit="cover"
            source={{ uri: sourcePhoto.uri }}
            style={styles.image}
            transition={180}
          />

          <View style={styles.form}>
            <AppText variant="subheading">Caption</AppText>
            <TextInput
              maxLength={120}
              multiline
              onChangeText={handleCaptionChange}
              placeholder={
                isDraftMode
                  ? "Tell the story behind this moment"
                  : "Write a new caption"
              }
              placeholderTextColor={theme.colors.muted}
              style={styles.input}
              textAlignVertical="top"
              value={caption}
            />
            <AppText tone="muted" variant="caption">
              {caption.length}/120 characters
            </AppText>
          </View>

          {error ? (
            <View style={styles.error}>
              <AppText tone="inverse">{error}</AppText>
            </View>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                Keyboard.dismiss();
                router.back();
              }}
              style={styles.button}
            >
              <AppText variant="subheading">Cancel</AppText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => void saveChanges()}
              style={[styles.button, styles.primaryButton]}
            >
              <AppText tone="inverse" variant="subheading">
                {isSaving ? "Saving..." : isDraftMode ? "Save photo" : "Save"}
              </AppText>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
