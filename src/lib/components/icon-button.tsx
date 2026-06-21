import { Pressable, type PressableProps } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { AppIcon } from "@/lib/components/app-icon";
import { AppText } from "@/lib/components/app-text";
import { cn } from "@/lib/utils/cn";

type IconButtonProps = PressableProps & {
  icon: LucideIcon;
  label: string;
  className?: string;
  textClassName?: string;
  iconColor?: string;
  size?: number;
  showLabel?: boolean;
};

export function IconButton({
  icon,
  label,
  className,
  textClassName,
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
      className={cn(
        "flex-row items-center justify-center rounded-full bg-surface/90 px-3 py-2",
        className,
      )}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      {...props}
    >
      <AppIcon color={iconColor} icon={icon} size={size} />
      {showLabel ? (
        <AppText className={cn("ml-2", textClassName)} variant="body">
          {label}
        </AppText>
      ) : null}
    </Pressable>
  );
}
