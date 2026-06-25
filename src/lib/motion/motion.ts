import { Easing } from "react-native-reanimated";
import { designTokens } from "@/theme/tokens";

export const motion = {
  duration: {
    fast: designTokens.motion.fast,
    standard: designTokens.motion.standard,
    slow: 320,
  },
  easing: {
    out: Easing.bezier(0.22, 1, 0.36, 1),
    quick: Easing.bezier(0.25, 1, 0.5, 1),
  },
} as const;
