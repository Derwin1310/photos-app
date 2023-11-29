import { Image, ImageBackground, StyleSheet, View } from 'react-native'
import { Marker } from 'react-native-maps'
import { users } from '../../data/usersData'
import ellipse from "../../../assets/ellipse.png"
import { StyledText, colors } from '../../theme'

export const UserItem = () => (
  users.map(({ name, username, latitude, longitude, pro }) => (
    <Marker
      key={username}
      coordinate={{ latitude, longitude }}
      style={styles.markerContainer}
    >
      {pro && (
          <View style={styles.pro}>
            <StyledText
              juaRegular
              small
              color={colors.light}
            >
              PRO
            </StyledText>
          </View>
        )
      }
      <ImageBackground
        source={ellipse}
        resizeMode="stretch"
        style={styles.ellipse}
      >
        <Image
          source={{ uri: `https://maps-app1.s3.amazonaws.com/profile-pic/bogota/${username}.jpeg` }}
          resizeMode="stretch"
          style={styles.profileImg}
        />
      </ImageBackground>
      <View style={styles.wrapperBg} />
      <View style={styles.nameWrapper}>
        <StyledText
          small
          kalamBold
        >
          {name}
        </StyledText>
        <StyledText
          small
          kalamRegular
        >
          {username}
        </StyledText>
      </View>
    </Marker>
  ))
)


const styles = StyleSheet.create({
  markerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10
  },
  ellipse: {
    width: 50,
    height: 65,
    paddingTop: 5,
    alignItems: "center",
    zIndex: 100,
  },
  pro: {
    position: "absolute",
    top: -3,
    left: 40,
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 100
  },
  nameWrapper: {
    backgroundColor: colors.primary,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    height: 48,
  },
  wrapperBg: {
    backgroundColor: colors.primary,
    position: "absolute",
    height: 48,
    width: 30,
    left: 20
  }
})