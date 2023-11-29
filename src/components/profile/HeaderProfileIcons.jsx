import { StyleSheet, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { profileData } from '../../data/profileData';
import { colors, StyledText } from '../../theme';

export const HeaderProfileIcons = () => {
  return (
    <View style={styles.iconsWrapper}>
      {profileData.map(({ name, icon, amount }) => (
        <View key={name}>
          <StyledText kalamLight>
            {name}
          </StyledText>
          <View style={styles.icon}>
            <AntDesign name={icon} size={24} color={colors.dark} />
            <StyledText
              kalamRegular
              regular
              extraStyles={styles.amount}
            >
              {amount}
            </StyledText>
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  iconsWrapper: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between"
  },
  icon: {
    flexDirection: "row"
  },
  amount: {
    left: 5
  }
})