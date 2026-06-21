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
import { useGallery } from "@/features/gallery/gallery-provider";
import { AppText } from "@/lib/components/app-text";
import { ErrorState } from "@/lib/components/error-state";

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
      <View className="flex-1 justify-center px-5">
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

        await MediaLibrary.saveToLibraryAsync(sourcePhoto.uri);
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
      className="flex-1 bg-canvas"
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ title: isDraftMode ? "Caption photo" : "Edit photo" }} />
      <Pressable
        className="flex-1 justify-center bg-canvas px-5 pb-8 pt-6"
        onPress={Keyboard.dismiss}
      >
        <View className="gap-5 rounded-[32px] bg-surface p-5">
          <Image
            className="aspect-[16/10] w-full rounded-[26px] bg-canvas"
            contentFit="cover"
            source={{ uri: sourcePhoto.uri }}
            transition={180}
          />

          <View className="gap-2">
            <AppText variant="subheading">Caption</AppText>
            <TextInput
              className="min-h-28 rounded-[24px] bg-canvas px-4 py-4 font-kalam text-base text-ink"
              maxLength={120}
              multiline
              onChangeText={handleCaptionChange}
              placeholder={
                isDraftMode
                  ? "Tell the story behind this moment"
                  : "Write a new caption"
              }
              placeholderTextColor="#8a7d73"
              textAlignVertical="top"
              value={caption}
            />
            <AppText tone="muted" variant="caption">
              {caption.length}/120 characters
            </AppText>
          </View>

          {error ? (
            <View className="rounded-[22px] bg-danger/90 px-4 py-3">
              <AppText tone="inverse">{error}</AppText>
            </View>
          ) : null}

          <View className="flex-row justify-end gap-3">
            <Pressable
              accessibilityRole="button"
              className="rounded-full bg-canvas px-5 py-3"
              onPress={() => {
                Keyboard.dismiss();
                router.back();
              }}
            >
              <AppText variant="subheading">Cancel</AppText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="rounded-full bg-accent px-5 py-3"
              onPress={() => void saveChanges()}
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
