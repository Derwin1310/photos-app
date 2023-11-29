import { StyleSheet, View } from 'react-native'
import MapView from 'react-native-maps';
import { UserItem } from '../components';
import { users } from '../data/usersData'
import { Entypo } from '@expo/vector-icons';
import { StyledText, colors } from '../theme';

export const Map = () => (
  <>
    <View style={styles.textWrapper}>
      <Entypo name="camera" size={24} color="black" />
      <StyledText
        kalamBold
        extraStyles={styles.text}
      >
        {users.length} photographers in your area
      </StyledText>
    </View>
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 4.629323,
        longitude: -74.105656,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04
      }}
      rotateEnabled={false}
      minZoomLevel={11}
    >
      <UserItem />
    </MapView>
  </>
)

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  textWrapper: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center"
  }
})