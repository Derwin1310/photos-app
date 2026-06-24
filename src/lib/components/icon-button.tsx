import { Pressable, type PressableProps, type TextProps, type ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { AppIcon } from "@/lib/components/app-icon";
import { AppText } from "@/lib/components/app-text";
import { styles } from "./icon-button.styles";

type IconButtonProps = Omit<PressableProps, "style"> & {
  icon: LucideIcon;
  label: string;
  style?: PressableProps["style"];
  textStyle?: TextProps["style"];
  iconColor?: string;
  size?: number;
  showLabel?: boolean;
};

export function IconButton({
  icon,
  label,
  style,
  textStyle,
  iconColor,
  size = 22,
  showLabel = false,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={10}
      style={(state) => [
        styles.button,
        typeof style === "function" ? style(state) : style,
        state.pressed && styles.pressed,
      ] as ViewStyle[]}
      {...props}
    >
      <AppIcon color={iconColor} icon={icon} size={size} />
      {showLabel ? (
        <AppText style={[styles.label, textStyle]} variant="body">
          {label}
        </AppText>
      ) : null}
    </Pressable>
  );
}
