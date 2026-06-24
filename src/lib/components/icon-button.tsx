import { Pressable, type PressableProps, type ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useUnistyles } from "react-native-unistyles";
import { AppIcon } from "@/lib/components/app-icon";
import { AppText } from "@/lib/components/app-text";
import { styles } from "./icon-button.styles";

type IconButtonProps = Omit<PressableProps, "style"> & {
  icon: LucideIcon;
  label: string;
  size?: "md" | "sm";
  showLabel?: boolean;
  variant?: "ghost" | "overlay" | "primary" | "surface";
};

export function IconButton({
  icon,
  label,
  size = "md",
  showLabel = false,
  variant = "surface",
  ...props
}: IconButtonProps) {
  const { theme } = useUnistyles();
  const iconColor =
    variant === "primary" || variant === "overlay"
      ? theme.colors.textInverse
      : theme.colors.text;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={10}
      style={(state) => [
        styles.button(variant, size, showLabel),
        state.pressed && styles.pressed,
      ] as ViewStyle[]}
      {...props}
    >
      <AppIcon color={iconColor} icon={icon} size={size === "md" ? 20 : 18} />
      {showLabel ? (
        <AppText style={styles.label(variant)} variant="bodySmall">
          {label}
        </AppText>
      ) : null}
    </Pressable>
  );
}
