import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { colors, StyledText } from '../../theme'
import { MaterialIcons } from '@expo/vector-icons';
import { useImgOptions } from '../../hooks';

export const PhotoOptions = ({ img, description }) => {
  const { shareImage, editImage, deleteImage } = useImgOptions(img)

  const profileButtons = [
    { name: "share", onPress: shareImage },
    { name: "edit", onPress: () => editImage(description) },
    { name: "delete", onPress: () => deleteImage(img) },
  ]

  return (
    <View style={styles.buttonsWrapper}>
      {profileButtons.map(({ name, onPress}) => (
        <TouchableOpacity
          key={name}
          style={styles.iconsWrapper}
          activeOpacity={.7}
          onPress={onPress}
        >
          <MaterialIcons
            name={name}
            size={24}
            color={colors.dark}
          />
          <StyledText
            capitalize
            kalamLight
          >
            {name}
          </StyledText>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  iconsWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  buttonsWrapper: {
    flexDirection: "row",
  }
})