import { useEffect } from "react";
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { motion } from "@/lib/motion/motion";

type EntranceAnimationOptions = {
  delay?: number;
  distance?: number;
};

export function useEntranceAnimation({
  delay = 0,
  distance = 14,
}: EntranceAnimationOptions = {}) {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    progress.value = reducedMotion ? 1 : 0;
    progress.value = withDelay(
      reducedMotion ? 0 : delay,
      withTiming(1, {
        duration: reducedMotion ? 0 : motion.duration.standard,
        easing: motion.easing.out,
      }),
    );
  }, [delay, progress, reducedMotion]);

  return useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * distance }],
  }));
}
