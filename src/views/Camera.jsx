
import { useEffect, useState } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { Camera as CameraExpo } from 'expo-camera'
import { requestPermissionsAsync } from 'expo-media-library'
import { colors } from '../theme'
import { useIsFocused } from '@react-navigation/native'
import { CameraPicture } from './CameraPicture'
import { useCamera } from '../hooks'
import { CameraButtons } from '../components'

const { width } = Dimensions.get("window")

export const Camera = () => {
  const [hasPermission, setHasPermission] = useState(false)
  const isFocused = useIsFocused()
  const {
    type,
    image,
    flash,
    cameraRef,
    takePicture,
    toggleCameraFlash,
    toggleCameraType,
    saveImage,
    addDescription,
    deleteImage
  } = useCamera()

  useEffect(() => {
    (async () => {
      requestPermissionsAsync()
      const cameraStatus = await CameraExpo.requestCameraPermissionsAsync()
      setHasPermission(cameraStatus.status === "granted")
    })()
  },[])

  const buttonOptions = [
    {
      name: flash ? "flash" : "flash-off",
      onPress: toggleCameraFlash,
      size: 30
    },
    {
      name: "radio-button-on",
      onPress: takePicture,
      size: 70
    },
    {
      name: "md-sync-circle-outline",
      onPress: toggleCameraType,
      size: 45
    },
  ]

  return (
    isFocused && (
      image
      ? <CameraPicture
          img={image}
          saveImage={saveImage}
          addDescription={addDescription}
          deleteImage={deleteImage}
        />
      : (
        <CameraExpo
          ratio="16:9"
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
        >
          <View style={styles.menu}>
            {buttonOptions.map(({ name, onPress, size }) => (
              <CameraButtons
                key={name}
                name={name}
                onPress={onPress}
                size={size}
              />
            ))}
          </View>
        </CameraExpo>
      )
    )
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  menu: {
    width,
    paddingVertical: 5,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row"
  }
})