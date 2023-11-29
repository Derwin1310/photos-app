import { StyleSheet, View } from 'react-native'
import { StyledText } from '../theme/StyledText'
import { colors } from '../theme/colors'

export const NotAvaliable = () => (
  <View style={styles.view}>
    <StyledText
      title
      kalamBold
      center
      style={styles.text}
    >
      This feacture is not avaliable for the moment :(
    </StyledText>
  </View>
)


const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
  },
  text: {
    textShadowColor: '#0007',
    textShadowOffset: {width: -3, height: 3},
    textShadowRadius: 15
  }
})