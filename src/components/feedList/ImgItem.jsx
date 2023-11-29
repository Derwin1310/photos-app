import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Pressable
} from 'react-native'
import { Collections } from '../collections/Collections'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import like from '../../../assets/like.png'
import unliked from '../../../assets/unliked.png'
import Animated from 'react-native-reanimated'
import { useLike } from '../../hooks'
import { colors, StyledText } from '../../theme'

const { width, height } = Dimensions.get("window")

const AnimatedImage = Animated.createAnimatedComponent(Image)

export const ImgItem = ({ profilePic, author, location, img, desc, index }) => {
  const {
    doubleTap,
    style,
    isLiked,
    handleUnlike
  } = useLike()

  return (
    <>
      {index ? null : <Collections />}
      <View style={styles.container}>
        <View style={styles.profileWrapper}>
          <Image
            source={{ uri: profilePic }}
            style={styles.picture}
            resizeMode="cover"
          />
          <View style={styles.textWrapper}>
            <StyledText
              kalamBold
              regular
            >
              {author || "Anonymous"}
            </StyledText>
            <StyledText
              kalamLight
              small
            >
              From {location || "Somewhere..."}
            </StyledText>
          </View>
        </View>
        <StyledText
          kalamRegular
          regular
          extraStyles={styles.textDesc}
        >
          {desc || "No caption needed"}
        </StyledText>
        <ImageBackground
          source={{ uri: img }}
          style={styles.img}
          resizeMode="stretch"
        >
          <GestureDetector gesture={Gesture.Exclusive(doubleTap)}>
            <Animated.View>
              <AnimatedImage
                source={like}
                style={style}
                resizeMode="center"
              />
            </Animated.View>
          </GestureDetector>
          <Pressable
            style={styles.likeWrapper}
            onPress={handleUnlike}
          >
            <Image
              source={unliked}
              style={styles.unliked}
              resizeMode="center"
            />
            <Image
              source={like}
              style={[styles.liked, { transform: [{ scale: isLiked ? 1 : 0 }] }]}
              resizeMode="center"
            />
          </Pressable>
        </ImageBackground>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10
  },
  profileWrapper: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingLeft: 15
  },
  picture: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.tertiary
  },
  textWrapper: {
    paddingLeft: 10,
    justifyContent: "center"
  },
  textDesc: {
    paddingLeft: 20,
    paddingBottom: 5
  },
  img: {
    width,
    height: height * .65,
    alignItems: "center",
    justifyContent: "center"
  },
  likeWrapper: {
    width: 40,
    height: 40,
    position: "absolute",
    bottom: 5,
    right: 5,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  liked: {
    width: 30,
    height: 30,
  },
  unliked: {
    width: 30,
    height: 30,
    position: "absolute"
  }
})