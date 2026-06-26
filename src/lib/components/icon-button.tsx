import type React from "react";
import { Pressable, type PressableProps } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useUnistyles } from "react-native-unistyles";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AppIcon } from "@/lib/components/app-icon";
import { AppText } from "@/lib/components/app-text";
import { motion } from "@/lib/motion/motion";
import { styles } from "./icon-button.styles";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type IconButtonProps = Omit<PressableProps, "style"> & {
  icon: LucideIcon;
  label: string;
  size?: "md" | "sm";
  showLabel?: boolean;
  variant?: "danger" | "ghost" | "overlay" | "primary" | "surface";
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  onPressIn,
  onPressOut,
  size = "md",
  showLabel = false,
  variant = "surface",
  ...props
}) => {
  const { theme } = useUnistyles();
  const reducedMotion = useReducedMotion();
  const pressScale = useSharedValue(1);
  const iconColor =
    variant === "primary" || variant === "overlay"
      ? theme.colors.textInverse
      : variant === "danger"
        ? theme.colors.danger
      : theme.colors.text;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={10}
      {...props}
      onPressIn={(event) => {
        pressScale.value = withTiming(reducedMotion ? 1 : 0.96, {
          duration: motion.duration.fast,
          easing: motion.easing.quick,
        });
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressScale.value = withTiming(1, {
          duration: motion.duration.fast,
          easing: motion.easing.out,
        });
        onPressOut?.(event);
      }}
      style={[
        styles.button(variant, size, showLabel),
        animatedStyle,
      ]}
    >
      <AppIcon color={iconColor} icon={icon} size={size === "md" ? 20 : 18} />
      {showLabel ? (
        <AppText style={styles.label(variant)} variant="bodySmall">
          {label}
        </AppText>
      ) : null}
    </AnimatedPressable>
  );
};
