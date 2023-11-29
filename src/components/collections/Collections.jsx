import { Dimensions, StyleSheet, View } from 'react-native'
import { StyledText, colors } from '../../theme'
import { CarrouselCollection } from './CarrouselCollection'

const { height } = Dimensions.get("window")

export const Collections = () => (
  <View style={styles.collectionWrapper}>
    <StyledText
      kalamBold
      big
    >
      My collections
    </StyledText>
    <CarrouselCollection />
    <StyledText
      kalamBold
      big
    >
      Activity feed
    </StyledText>
  </View>
)


const styles = StyleSheet.create({
  collectionWrapper: {
    height: height * .31,
    backgroundColor: colors.primary,
    padding: 15,
    justifyContent: "space-between"
  }
})