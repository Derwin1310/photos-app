import {
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
  Dimensions
} from 'react-native'
import homeBg from '../../assets/home-background.png'
import { StyledText, colors } from '../theme'

const { width, height } = Dimensions.get("window")

export const Home = ({ navigation }) => (
  <ImageBackground
      source={homeBg}
      resizeMode="stretch"
      style={styles.background}
    >
    <View style={styles.homeWrapper}>
      <View style={styles.textWrapper}>
        <StyledText
          title
          juaRegular
          color={colors.light}
          extraStyles={styles.homeTitle}
        >
          PhotoSearch
        </StyledText>
        <StyledText
          kalamRegular
          color={colors.light}
          regular
        >
          Find your best photographer in the city
        </StyledText>
      </View>
      <Pressable
        style={styles.searchBtn}
        onPress={() => navigation.navigate("TabNavigator")}
      >
        <StyledText
          big
          color={colors.light}
          center
          juaRegular
        >
          Search
        </StyledText>
      </Pressable>
    </View>
  </ImageBackground>
)

const styles = StyleSheet.create({
  background: {
    flex: 1
  },
  homeWrapper: {
    width,
    height: height * .35,
    backgroundColor: "#373334B2",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  textWrapper: {
    width,
    alignItems: "center"
  },
  homeTitle: {
    paddingBottom: 10,
    textShadowColor: '#0007',
    textShadowOffset: {width: -3, height: 3},
    textShadowRadius: 15
  },
  searchBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 50
  }
})