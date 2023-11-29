import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export const CameraButtons = ({ onPress, name, size }) => {
  return (
    <TouchableOpacity activeOpacity={.5} onPress={onPress}>
      <Ionicons name={name} size={size} color="white" />
    </TouchableOpacity>
  )
}