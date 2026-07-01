import type React from "react";
import { useRef, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { CameraView, type CameraType, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { router, useFocusEffect } from "expo-router";
import { Circle, Flashlight, FlashlightOff, RotateCcw, Trash2, Type } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { IconButton } from "@/lib/components/icon-button";
import { AppText } from "@/lib/components/app-text";
import { ErrorState } from "@/lib/components/error-state";
import { useGallery } from "@/features/gallery/gallery-provider";
import { motion } from "@/lib/motion/motion";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import { styles } from "./camera-screen.styles";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;
const StyledCameraView = withUnistyles(CameraView);
const StyledImage = withUnistyles(Image);

const CameraScreen: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [screenFocused, setScreenFocused] = useState(true);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const { clearDraftPhoto, createDraftPhoto, draftPhoto } = useGallery();
  const reducedMotion = useReducedMotion();
  const draftEntranceStyle = useEntranceAnimation({ distance: 10 });
  const shutterScale = useSharedValue(1);
  const shutterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shutterScale.value }],
  }));

  useFocusEffect(() => {
    setScreenFocused(true);

    return () => {
      setScreenFocused(false);
    };
  });

  const capturePhoto = async () => {
    if (!cameraRef.current || isCapturing) {
      return;
    }

    setIsCapturing(true);
    shutterScale.value = withSequence(
      withTiming(reducedMotion ? 1 : 0.92, {
        duration: motion.duration.fast,
        easing: motion.easing.quick,
      }),
      withTiming(1, {
        duration: motion.duration.standard,
        easing: motion.easing.out,
      }),
    );

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
  };

  const discardPhoto = () => {
    Alert.alert(t("camera.discardTitle"), t("camera.discardMessage"), [
      { style: "cancel", text: t("camera.keepEditing") },
      {
        style: "destructive",
        text: t("camera.discard"),
        onPress: () => {
          clearDraftPhoto();
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning,
          ).catch(() => undefined);
        },
      },
    ]);
  };

  if (!permission) {
    return (
      <View style={styles.checking}>
        <AppText center tone="inverse">
          {t("camera.checkingAccess")}
        </AppText>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permission}>
        <ErrorState
          actionLabel={t("camera.grantAccess")}
          message={t("camera.permissionMessage")}
          onRetry={() => void requestPermission()}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {draftPhoto ? (
        <AnimatedView style={[styles.draftRoot, draftEntranceStyle]}>
          <StyledImage
            contentFit="cover"
            source={{ uri: draftPhoto.uri }}
            style={styles.draftImage}
          />

          <View style={styles.draftOverlay}>
            <View>
              <View style={styles.message}>
                <AppText center tone="inverse" variant="bodySmall">
                  {t("camera.draftMessage")}
                </AppText>
              </View>
            </View>

            <View style={styles.draftActions}>
              <View style={styles.draftRow}>
                <IconButton
                  icon={Trash2}
                  label={t("camera.discardPhoto")}
                  onPress={discardPhoto}
                  showLabel
                  variant="overlay"
                />
                <IconButton
                  icon={Type}
                  label={t("camera.addCaption")}
                  onPress={() =>
                    router.push({
                      pathname: "/(modals)/edit-photo",
                      params: { mode: "draft" },
                    })
                  }
                  showLabel
                  variant="primary"
                />
              </View>
            </View>
          </View>
        </AnimatedView>
      ) : (
        <>
          <StyledCameraView
            ref={cameraRef}
            active={screenFocused && !draftPhoto}
            enableTorch={torchEnabled}
            facing={facing}
            mirror={facing === "front"}
            style={styles.camera}
          />

          <View style={styles.cameraOverlay}>
            <View style={styles.topControl}>
              <IconButton
                icon={torchEnabled ? Flashlight : FlashlightOff}
                label={torchEnabled ? t("camera.torchOn") : t("camera.torchOff")}
                onPress={() => setTorchEnabled((value) => !value)}
                variant="overlay"
              />
            </View>

            <View style={styles.tutorial}>
              <AppText center style={styles.tutorialText} tone="inverse">
                {t("camera.captureHint")}
              </AppText>

              <View style={styles.captureRow}>
                <IconButton
                  icon={RotateCcw}
                  label={t("camera.flipCamera")}
                  onPress={() =>
                    setFacing((value) => (value === "back" ? "front" : "back"))
                  }
                  variant="overlay"
                />
                <AnimatedPressable
                  accessibilityLabel={t("camera.capturePhoto")}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isCapturing }}
                  disabled={isCapturing}
                  hitSlop={10}
                  onPress={() => void capturePhoto()}
                  style={[styles.shutter, shutterStyle]}
                >
                  <Circle color={theme.colors.accentSecondary} fill={theme.colors.accentSecondary} size={theme.size.shutterIcon} strokeWidth={1.8} />
                </AnimatedPressable>
                <View style={styles.spacer} />
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default CameraScreen;
