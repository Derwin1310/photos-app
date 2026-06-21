import { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { CameraView, type CameraType, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { router, useFocusEffect } from "expo-router";
import { Circle, Flashlight, FlashlightOff, RotateCcw, Trash2, Type } from "lucide-react-native";
import { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "@/lib/components/icon-button";
import { AppText } from "@/lib/components/app-text";
import { ErrorState } from "@/lib/components/error-state";
import { useGallery } from "@/features/gallery/gallery-provider";

export default function CameraScreen() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [screenFocused, setScreenFocused] = useState(true);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { bottom, top } = useSafeAreaInsets();
  const { clearDraftPhoto, createDraftPhoto, draftPhoto } = useGallery();

  useFocusEffect(() => {
    setScreenFocused(true);

    return () => {
      setScreenFocused(false);
    };
  });

  async function capturePhoto() {
    if (!cameraRef.current || isCapturing) {
      return;
    }

    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });

      if (!photo?.uri) {
        return;
      }

      createDraftPhoto(photo.uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    } finally {
      setIsCapturing(false);
    }
  }

  function discardPhoto() {
    Alert.alert("Discard photo?", "This capture will be removed.", [
      { style: "cancel", text: "Keep editing" },
      {
        style: "destructive",
        text: "Discard",
        onPress: () => {
          clearDraftPhoto();
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning,
          ).catch(() => undefined);
        },
      },
    ]);
  }

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <AppText center tone="inverse">
          Checking camera access...
        </AppText>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center bg-canvas px-5">
        <ErrorState
          actionLabel="Grant camera access"
          message="Camera access lets you capture a photo and save it into your local gallery."
          onRetry={() => void requestPermission()}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {draftPhoto ? (
        <View className="flex-1">
          <Image
            className="absolute inset-0"
            contentFit="cover"
            source={{ uri: draftPhoto.uri }}
          />

          <View
            className="flex-1 justify-between px-5 pb-6"
            style={{ paddingTop: top + 20, paddingBottom: bottom + 16 }}
          >
            <View className="items-end gap-3">
              <View className="max-w-[250px] rounded-[24px] bg-black/60 px-4 py-3">
                <AppText center tone="inverse" variant="caption">
                  Continue to the caption sheet to name this moment and save it to
                  your gallery.
                </AppText>
              </View>
            </View>

            <View className="gap-4">
              <View className="flex-row items-center justify-between gap-3">
                <IconButton
                  className="flex-1 bg-black/60 py-3"
                  icon={Trash2}
                  iconColor="#ffffff"
                  label="Discard photo"
                  onPress={discardPhoto}
                  showLabel
                  textClassName="text-white"
                />
                <IconButton
                  className="flex-1 bg-white py-3"
                  icon={Type}
                  iconColor="#3a3636"
                  label="Add caption"
                  onPress={() =>
                    router.push({
                      pathname: "/(modals)/edit-photo",
                      params: { mode: "draft" },
                    })
                  }
                  showLabel
                  textClassName="text-ink"
                />
              </View>
            </View>
          </View>
        </View>
      ) : (
        <>
          <CameraView
            ref={cameraRef}
            active={screenFocused && !draftPhoto}
            className="flex-1"
            enableTorch={torchEnabled}
            facing={facing}
            mirror={facing === "front"}
          />

          <View
            className="absolute inset-x-0 justify-between px-5"
            style={{ bottom: bottom + 18, top: top + 18 }}
          >
            <View className="items-start">
              <IconButton
                className="bg-black/55"
                icon={torchEnabled ? Flashlight : FlashlightOff}
                iconColor="#ffffff"
                label={torchEnabled ? "Torch on" : "Torch off"}
                onPress={() => setTorchEnabled((value) => !value)}
              />
            </View>

            <View className="items-center gap-5">
              <AppText center className="max-w-xs" tone="inverse">
                Capture a moment, then add a caption before saving it to your
                journal.
              </AppText>

              <View className="flex-row items-center justify-center gap-6">
                <IconButton
                  className="bg-black/55"
                  icon={RotateCcw}
                  iconColor="#ffffff"
                  label="Flip camera"
                  onPress={() =>
                    setFacing((value) => (value === "back" ? "front" : "back"))
                  }
                />
                <Pressable
                  accessibilityLabel="Capture photo"
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isCapturing }}
                  className="items-center justify-center rounded-full border-4 border-white bg-white/20 p-4"
                  disabled={isCapturing}
                  hitSlop={10}
                  onPress={() => void capturePhoto()}
                >
                  <Circle color="#ffffff" fill="#ffffff" size={54} strokeWidth={1.8} />
                </Pressable>
                <View className="w-[52px]" />
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
