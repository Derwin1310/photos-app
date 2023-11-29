import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { StyledText, colors } from '../../theme'
import Logo from '../../../assets/header/logo.png'

const { height } = Dimensions.get("window")

export const Header = () => (
  <View style={styles.headerWrapper}>
    <Image
      source={Logo}
      resizeMode="stretch"
    />
    <StyledText
      juaRegular
      big
      color={colors.secondary}
      style={styles.headerTitle}
    >
      PhotoSearch
    </StyledText>
  </View>
)


const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    height: height * .1,
    paddingHorizontal: 20,
    alignItems: "center"
  },
  headerTitle: {
    paddingLeft: 15
  }
})