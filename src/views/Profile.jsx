import { useContext, useEffect,  } from 'react';
import { StyleSheet, View, FlatList, Button } from 'react-native'
import { HeaderProfile, PhotoItem } from '../components';
import { StyledText } from '../theme';
import { store } from '../context/store';
import { Modal } from './Modal';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Profile = () => {
  const {
    isModalVisible,
    galleryImg,
    loadData,
    effects: {
      loadPhotosList
    }
} = useContext(store)
  const isFocused = useIsFocused()

  useEffect(() => {loadPhotosList()}, [galleryImg])

  const renderItems = ({ item }) => {
    const { desc, image } = item
    return <PhotoItem description={desc} img={image} />
  }

  return (
    <View style={styles.profileContainer}>
      <HeaderProfile />
      <FlatList
        ListHeaderComponent={
          <StyledText
            juaRegular
            big
            center
            extraStyles={{ marginTop: 20 }}
          >
            My Photos
          </StyledText>
        }
        data={loadData}
        renderItem={renderItems}
        keyExtractor={item => item.image}
      />
      {(isFocused && isModalVisible) && <Modal message="New description" />}
    </View>
  )
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1
  }
})