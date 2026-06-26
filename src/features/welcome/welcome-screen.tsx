import type React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { images } from "@/assets/images";
import { useAuth } from "@/features/auth/auth-provider";
import { AppText } from "@/lib/components/app-text";
import { styles } from "./welcome-screen.styles";
import { motion } from "@/lib/motion/motion";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;
const StyledImage = withUnistyles(Image);

const GoogleIcon: React.FC = () => (
  <Svg accessibilityElementsHidden focusable={false} height={20} viewBox="0 0 24 24" width={20}>
    <Path
      d="M21.805 10.041H21V10H12v4h5.651C16.827 16.328 14.611 18 12 18a6 6 0 1 1 4.243-10.243l2.828-2.828A9.969 9.969 0 0 0 12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10c0-.671-.069-1.325-.195-1.959Z"
      fill="#FFC107"
    />
    <Path
      d="m3.153 7.345 3.286 2.409A5.997 5.997 0 0 1 12 6c1.529 0 2.921.577 3.979 1.521l2.828-2.828A9.969 9.969 0 0 0 12 2a9.994 9.994 0 0 0-8.847 5.345Z"
      fill="#FF3D00"
    />
    <Path
      d="M12 22a9.954 9.954 0 0 0 6.71-2.588l-3.095-2.619A5.955 5.955 0 0 1 12 18a5.997 5.997 0 0 1-5.641-3.973l-3.262 2.514A9.996 9.996 0 0 0 12 22Z"
      fill="#4CAF50"
    />
    <Path
      d="M21.805 10.041H21V10H12v4h5.651a6.02 6.02 0 0 1-2.04 2.793l.001-.001 3.095 2.619C18.488 19.61 22 17 22 12c0-.671-.069-1.325-.195-1.959Z"
      fill="#1976D2"
    />
  </Svg>
);

const WelcomeScreen: React.FC = () => {
  const { errorMessage, isSigningIn, signInWithGoogle } = useAuth();
  const { theme } = useUnistyles();
  const reducedMotion = useReducedMotion();
  const pressScale = useSharedValue(1);
  const cardEntranceStyle = useEntranceAnimation({ distance: 18 });
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <View style={styles.root}>
      <StyledImage contentFit="cover" source={images.homeBackground} style={styles.background} />
      <View style={styles.content}>
        <AnimatedView style={[styles.card, cardEntranceStyle]}>
          <View style={styles.brandRow}>
            <View style={styles.icon}>
              <StyledImage contentFit="cover" source={images.logo} style={styles.iconImage} />
            </View>
            <AppText tone="inverse" variant="display">
              PicXplorer
            </AppText>
          </View>

          <View style={styles.copy}>
            <AppText style={styles.title} tone="inverse" variant="headline">
              A personal gallery for the places and people you notice.
            </AppText>
            <AppText tone="inverse" variant="bodySmall">
              Browse editorial collections, capture a new frame, and keep the
              moments that matter close.
            </AppText>
          </View>

          {errorMessage ? (
            <View accessibilityLiveRegion="polite" style={styles.errorPanel}>
              <AppText style={styles.errorTitle} variant="title">
                Sign-in did not finish
              </AppText>
              <AppText style={styles.errorMessage} variant="bodySmall">
                {errorMessage} Try again, or check your connection before reopening Google.
              </AppText>
            </View>
          ) : null}

          <AnimatedPressable
            accessibilityLabel="Sign in with Google"
            accessibilityHint="Opens Google sign-in in Auth0, then returns to PicXplorer."
            accessibilityRole="button"
            accessibilityState={{ busy: isSigningIn, disabled: isSigningIn }}
            disabled={isSigningIn}
            hitSlop={8}
            onPressIn={() => {
              pressScale.value = withTiming(reducedMotion ? 1 : 0.97, {
                duration: motion.duration.fast,
                easing: motion.easing.quick,
              });
            }}
            onPressOut={() => {
              pressScale.value = withTiming(1, {
                duration: motion.duration.fast,
                easing: motion.easing.out,
              });
            }}
            onPress={() => void signInWithGoogle()}
            style={[
              styles.signInButton,
              isSigningIn && styles.signInButtonDisabled,
              pressStyle,
            ]}
          >
            {isSigningIn ? (
              <ActivityIndicator color={theme.colors.text} size="small" />
            ) : (
              <GoogleIcon />
            )}
            <AppText style={styles.signInLabel}>
              {isSigningIn ? "Opening Google..." : "Sign in with Google"}
            </AppText>
          </AnimatedPressable>
        </AnimatedView>
      </View>
    </View>
  );
};

export default WelcomeScreen;
