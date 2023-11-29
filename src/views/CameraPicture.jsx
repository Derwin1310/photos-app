import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { colors, StyledText } from '../theme'
import { store } from '../context/store'
import { useContext } from 'react'
import { Modal } from './Modal'

export const CameraPicture = ({ img, saveImage, addDescription, deleteImage }) => {
  const { isModalVisible } = useContext(store)

  const options = [
    {
      iconName: "delete",
      onPress: deleteImage,
      text: "Delete",
      styles: styles.imgBtn
    },
    {
      iconName: "short-text",
      onPress: addDescription,
      text: "Add caption",
      styles: styles.caption
    },
    {
      iconName: "check",
      onPress: saveImage,
      text: "Save",
      styles: styles.imgBtn
    },
  ]

  return (
    <ImageBackground
      resizeMode='stretch'
      source={{ uri: img }}
      style={styles.imgScreen}
    >
      {options.map(({ iconName, onPress, text, styles }) => (
        <TouchableOpacity style={styles} onPress={onPress} key={text}>
          <MaterialIcons name={iconName} size={30} color={colors.light} />
          <StyledText
            kalamRegular
            regular
            color={colors.light}
          >
            {text}
          </StyledText>
        </TouchableOpacity>
      ))}
      { isModalVisible && <Modal message="Add a description for your picture!" />}
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  imgScreen: {
    flex: 1,
    padding: 30,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-end"
  },
  imgBtn: {
    flexDirection: "row",
    alignItems: "center"
  },
  caption: {
    position: 'absolute',
    top: 30,
    right: 30,
    flexDirection: "row",
    alignItems: "center"
  }
})