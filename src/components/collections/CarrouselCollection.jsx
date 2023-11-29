import { FlatList, View } from 'react-native'
import { CollectionItem } from './CollectionItem'

const listName = [
  "wedding",
  "outdoors",
  "portraits",
  "travel",
  "pets",
  "christmas",
  "products",
  "halloween"
]

export const CarrouselCollection = () => {
  const renderCollections = ({ item }) => <CollectionItem item={item} />

  return (
    <View>
      <FlatList
        horizontal
        data={listName}
        renderItem={renderCollections}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={<View style={{ margin: 8}}/>}
      />
    </View>
  )
}