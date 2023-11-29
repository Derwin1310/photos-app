import { useContext, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native'
import { store } from '../context/store'
import { usePhotos } from '../hooks'
import { getPhotos } from '../helpers/fetch'
import { StyledText, colors } from '../theme'

const { width, height } = Dimensions.get("window")

export const PhotosList = () => {
  const { listTitle } = useContext(store)
  const {
    currentPage,
    photos,
    loading,
    loadPhotos,
    loadPhotosCollection
  } = usePhotos(getPhotos, listTitle)

  useEffect(() => {
    loadPhotosCollection()
  }, [currentPage])

  const renderPhotos = ({ item }) => (
    <TouchableOpacity
      style={styles.listWrapper}
      activeOpacity={.6}
    >
      <Image
        source={{ uri: item?.urls?.small }}
        style={styles.photo}
        resizeMode="stretch"
      />
    </TouchableOpacity>
  )

  return (
    <View style={styles.wrapper}>
      <StyledText
        kalamBold
        center
        title
        capitalize
        style={styles.title}
      >
        {listTitle}
      </StyledText>
      <FlatList
        data={photos}
        renderItem={renderPhotos}
        keyExtractor={(item, i) => i}
        numColumns={3}
        ItemSeparatorComponent={<View style={{ margin: 8}}/>}
        onEndReached={loadPhotos}
        onEndReachedThreshold={.5}
      />
      {loading ? <ActivityIndicator size="large" color="#aaa" /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 20
  },
  title: {
    textShadowColor: '#0007',
    textShadowOffset: {width: -1, height: 2},
    textShadowRadius: 10
  },
  listWrapper: {
    flex: 1,
    paddingTop: 10
  },
  photo: {
    height: height * .25,
    width: width * .27,
    borderRadius: 10
  }
})