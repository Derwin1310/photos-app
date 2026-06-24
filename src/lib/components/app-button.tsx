import { Pressable, type PressableProps, type ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useUnistyles } from "react-native-unistyles";
import { AppIcon } from "@/lib/components/app-icon";
import { AppText } from "@/lib/components/app-text";
import { styles } from "./app-button.styles";

type AppButtonProps = Omit<PressableProps, "children"> & {
  fullWidth?: boolean;
  icon?: LucideIcon;
  label: string;
  size?: "md" | "sm";
  variant?: "destructive" | "primary" | "secondary" | "tertiary";
};

export function AppButton({
  fullWidth = false,
  icon,
  label,
  size = "md",
  variant = "primary",
  ...props
}: AppButtonProps) {
  const { theme } = useUnistyles();
  const iconColor =
    variant === "primary"
      ? theme.colors.onAccent
      : variant === "destructive"
        ? theme.colors.onDanger
        : theme.colors.text;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={8}
      style={(state) => [
        styles.button(variant, size, fullWidth),
        state.pressed && styles.pressed,
      ] as ViewStyle[]}
      {...props}
    >
      {icon ? <AppIcon color={iconColor} icon={icon} size={size === "md" ? 20 : 18} /> : null}
      <AppText style={styles.label(variant)}>{label}</AppText>
    </Pressable>
  );
}
