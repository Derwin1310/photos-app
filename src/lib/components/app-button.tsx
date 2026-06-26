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
import { styles } from "./app-button.styles";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type AppButtonProps = Omit<PressableProps, "children"> & {
  fullWidth?: boolean;
  icon?: LucideIcon;
  label: string;
  size?: "md" | "sm";
  variant?: "destructive" | "primary" | "secondary" | "tertiary";
};

export const AppButton: React.FC<AppButtonProps> = ({
  fullWidth = false,
  icon,
  label,
  onPressIn,
  onPressOut,
  size = "md",
  variant = "primary",
  ...props
}) => {
  const { theme } = useUnistyles();
  const reducedMotion = useReducedMotion();
  const pressScale = useSharedValue(1);
  const iconColor =
    variant === "primary"
      ? theme.colors.onAccent
      : variant === "destructive"
        ? theme.colors.onDanger
        : theme.colors.text;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={8}
      {...props}
      onPressIn={(event) => {
        pressScale.value = withTiming(reducedMotion ? 1 : 0.97, {
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
        styles.button(variant, size, fullWidth),
        props.disabled && styles.disabled,
        animatedStyle,
      ]}
    >
      {icon ? <AppIcon color={iconColor} icon={icon} size={size === "md" ? 20 : 18} /> : null}
      <AppText numberOfLines={1} style={styles.label(variant)}>
        {label}
      </AppText>
    </AnimatedPressable>
  );
};
