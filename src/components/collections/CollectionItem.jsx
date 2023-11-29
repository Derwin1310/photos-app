import { useContext } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Link } from '@react-navigation/native'
import { store } from '../../context/store'
import { StyledText } from '../../theme'

export const CollectionItem = ({ item }) => {
  const { effects: { setListTitle } } = useContext(store)

  const onNextPage = name => () => setListTitle(name)

  return (
    <Link
      to={{ screen: 'PhotosList' }}
      onPress={onNextPage(item)}
    >
      <View>
        <Image
          source={{ uri: `https://maps-app1.s3.amazonaws.com/collections/${item}.jpg` }}
          style={styles.imgCollection}
          resizeMode="stretch"
        />
        <StyledText
          regular
          kalamRegular
          capitalize
        >
          {item}
        </StyledText>
      </View>
    </Link>
  )
}

const styles = StyleSheet.create({
  imgCollection: {
    width: 100,
    height: 100,
    borderRadius: 10
  }
})