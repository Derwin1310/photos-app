import { StyleSheet, View, Image } from 'react-native'
import { colors, StyledText } from '../../theme'
import { PhotoOptions } from './PhotoOptions';

export const PhotoItem = ({ img, description }) => {
  return (
    <View style={styles.listWrapper}>
        <Image
          source={{ uri: img }}
          style={styles.img}
        />
      <View style={styles.optionsWrapper}>
        <StyledText
          kalamRegular
          regular
        >
          {description}
        </StyledText>
        <PhotoOptions img={img} description={description} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  img: {
    borderRadius: 20,
    width: 100,
    height: 100
  },
  listWrapper: {
    padding: 20,
    flexDirection: "row",
    borderColor: colors.secondary,
    elevation: 5,
    marginBottom: 10,
  },
  optionsWrapper: {
    flex: 1,
    left: 20,
    paddingVertical: 10,
    justifyContent: "space-between"
  }
})