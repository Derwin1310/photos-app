import type { ColorValue } from "react-native";
import type { LucideIcon } from "lucide-react-native";

type AppIconProps = {
  icon: LucideIcon;
  color?: ColorValue;
  size?: number;
  strokeWidth?: number;
};

export function AppIcon({
  icon: Icon,
  color = "#3a3636",
  size = 22,
  strokeWidth = 2.25,
}: AppIconProps) {
  return <Icon color={color} size={size} strokeWidth={strokeWidth} />;
}
