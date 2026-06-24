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

export function AppText({
  variant = "body",
  tone = "default",
  center = false,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[styles[variant], styles[tone], center && styles.center, style]}
    />
  );
}
