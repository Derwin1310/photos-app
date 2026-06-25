import type React from "react";
import type { ColorValue } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useUnistyles } from "react-native-unistyles";

type AppIconProps = {
  icon: LucideIcon;
  color?: ColorValue;
  size?: number;
  strokeWidth?: number;
};

export const AppIcon: React.FC<AppIconProps> = ({
  icon: Icon,
  color,
  size = 22,
  strokeWidth = 2.25,
}) => {
  const { theme } = useUnistyles();

  return <Icon color={color ?? theme.colors.text} size={size} strokeWidth={strokeWidth} />;
};
