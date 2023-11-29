import { Image, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native'
import { colors, StyledText } from '../../theme'
import { HeaderProfileIcons } from './HeaderProfileIcons'
import profilePic from '../../../assets/profilePic.png'

const { width } = Dimensions.get("window")

export const HeaderProfile = () => {
  return (
    <View style={styles.profileHeader}>
      <Image
        source={profilePic}
        resizeMode="stretch"
        style={styles.profilePic}
      />
      <View style={styles.container}>
        <StyledText
          kalamBold
          regular
        >
          Lína Ríos
        </StyledText>
        <StyledText
          kalamRegular
        >
          @lina_rios
        </StyledText>
        <HeaderProfileIcons />
        <TouchableOpacity
          activeOpacity={.7}
          style={styles.editBtn}
        >
          <StyledText
            juaRegular
            color={colors.light}
            center
          >
            Edit Profile
          </StyledText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  profileHeader: {
    width,
    backgroundColor: colors.primary,
    padding: 20,
    flexDirection: "row",
    // paddingBottom: 20
  },
  profilePic: {
    borderRadius: 100,
    width:  100,
    height: 100
  },
  container: {
    paddingLeft: 10,
    flex: 1
  },
  editBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    borderRadius: 5
  }
})