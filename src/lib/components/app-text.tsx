import { Text, type TextProps } from "react-native";
import { cn } from "@/lib/utils/cn";

type AppTextVariant =
  | "title"
  | "headline"
  | "subheading"
  | "body"
  | "caption"
  | "label";

type AppTextTone = "default" | "muted" | "accent" | "danger" | "inverse";

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  tone?: AppTextTone;
  center?: boolean;
  className?: string;
};

const variantClasses: Record<AppTextVariant, string> = {
  title: "font-jua text-4xl leading-tight",
  headline: "font-jua text-2xl leading-tight",
  subheading: "font-kalam-bold text-lg",
  body: "font-kalam text-base",
  caption: "font-kalam-light text-sm",
  label: "font-kalam-bold text-sm uppercase tracking-[1.5px]",
};

const toneClasses: Record<AppTextTone, string> = {
  default: "text-ink",
  muted: "text-muted",
  accent: "text-accent",
  danger: "text-danger",
  inverse: "text-white",
};

export function AppText({
  variant = "body",
  tone = "default",
  center = false,
  className,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      className={cn(
        variantClasses[variant],
        toneClasses[tone],
        center && "text-center",
        className,
      )}
    />
  );
}
