import type React from "react";
import { Text, type TextProps } from "react-native";
import { styles } from "./app-text.styles";

type AppTextVariant =
  | "body"
  | "bodySmall"
  | "display"
  | "headline"
  | "label"
  | "title";

type AppTextTone = "default" | "muted" | "accent" | "danger" | "inverse";

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  tone?: AppTextTone;
  center?: boolean;
};

export const AppText: React.FC<AppTextProps> = ({
  variant = "body",
  tone = "default",
  center = false,
  style,
  ...props
}) => (
  <Text
    {...props}
    style={[styles[variant], styles[tone], center && styles.center, style]}
  />
);
