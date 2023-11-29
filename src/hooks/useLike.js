import { useCallback, useState } from "react"
import { Gesture } from "react-native-gesture-handler"
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

export const useLike = () => {
  const [isLiked, setIsLiked] = useState(false)
  const scale = useSharedValue(0)

  const handleUnlike = () => setIsLiked(false)

  const style = useAnimatedStyle(() => ({
    transform: [
      { scale: Math.max(scale.value, 0) }
    ]
  }))

  const onDoubleTap = useCallback(() => {
    scale.value = withSpring(1, null, (isFinished) => {
      if (isFinished) scale.value = withSpring(0)
    })
    setIsLiked(true)
  }, [])

  const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .maxDuration(250)
  .onStart(onDoubleTap);

  return {
    doubleTap,
    style,
    isLiked,
    handleUnlike
  }
}
