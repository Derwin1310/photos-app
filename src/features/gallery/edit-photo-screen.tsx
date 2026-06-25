import { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import Animated from "react-native-reanimated";
import { useGallery } from "@/features/gallery/gallery-provider";
import { AppText } from "@/lib/components/app-text";
import { AppButton } from "@/lib/components/app-button";
import { ErrorState } from "@/lib/components/error-state";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import { styles } from "./edit-photo-screen.styles";

const AnimatedView = Animated.View;
const StyledImage = withUnistyles(Image);

function InlineError({ message }: { message: string }) {
  const entranceStyle = useEntranceAnimation({ distance: 6 });

  return (
    <AnimatedView style={[styles.error, entranceStyle]}>
      <AppText style={styles.errorText}>{message}</AppText>
    </AnimatedView>
  );
}

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
  const cardEntranceStyle = useEntranceAnimation({ distance: 12 });

  useEffect(() => {
    setCaption(sourcePhoto?.caption ?? "");
  }, [sourcePhoto?.caption]);

  const handleCaptionChange = (nextCaption: string) => {
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

  const saveChanges = async () => {
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
          throw new Error(
            "Allow photo library access to save this capture to your device and PicXplorer profile.",
          );
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
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
          () => undefined,
        );
      }

      Alert.alert(
        isDraftMode ? "Saved to profile" : "Caption updated",
        isDraftMode
          ? "Your capture is ready in your profile."
          : "Your updated caption is saved.",
        [{ text: "Done", onPress: () => router.back() }],
      );
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
        <AnimatedView style={[styles.card, cardEntranceStyle]}>
          <StyledImage
            contentFit="cover"
            source={{ uri: sourcePhoto.uri }}
            style={styles.image}
            transition={180}
          />

          <View style={styles.form}>
            <AppText variant="title">Caption</AppText>
            <TextInput
              maxLength={120}
              multiline
              onChangeText={handleCaptionChange}
              placeholder={
                isDraftMode
                  ? "Tell the story behind this moment"
                  : "Write a new caption"
              }
              placeholderTextColor={theme.colors.placeholder}
              style={styles.input}
              textAlignVertical="top"
              value={caption}
            />
            <AppText tone="muted" variant="bodySmall">
              {caption.length}/120 characters
            </AppText>
          </View>

          {error ? (
            <InlineError message={error} />
          ) : null}

          <View style={styles.actions}>
            <AppButton
              label="Cancel"
              onPress={() => {
                Keyboard.dismiss();
                router.back();
              }}
              variant="secondary"
            />
            <AppButton
              label={isSaving ? "Saving..." : isDraftMode ? "Save photo" : "Save"}
              disabled={isSaving}
              onPress={saveChanges}
              variant="primary"
            />
          </View>
        </AnimatedView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
