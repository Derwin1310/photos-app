import {
  StyleSheet,
  View,
  Modal
  as
  ModalExpo,
  TextInput,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { colors, StyledText } from '../theme'
import { useContext } from 'react';
import { store } from '../context/store';
import { setData } from '../helpers/storage';

const { width, height } = Dimensions.get("window")

export const Modal = ({ message }) => {
  const { isModalVisible, effects: { setIsModalVisible } } = useContext(store)
  const {
    inputText,
    editItem,
    loadData,
    effects:{
      setInputText,
      setLoadData
    }
  } = useContext(store)

  const handleEditDesc = async (editItem) => {
    try {
      const newList = loadData.map(item => item.image === editItem ? { ...item, desc: inputText } : item)
      await setData("galleryList", newList)
      setLoadData(newList)
    } catch (error) {
      console.log("Error on handleEditDesc: ", error)
    }
  }

  const onSaveEdit = () => {
    loadData && handleEditDesc(editItem)
    setIsModalVisible(!isModalVisible)
  }

  const onCancelEdit = () => setIsModalVisible(!isModalVisible)

  return (
    <ModalExpo
      animationType="fade"
      visible={isModalVisible}
      onRequestClose={onCancelEdit}
      transparent
    >
      <View style={styles.modalBg}>
        <View style={styles.modalView}>
          <StyledText
            kalamBold
            big
          >
            {message}
          </StyledText>
          <TextInput
            onChangeText={text => setInputText(text)}
            editable
            multiline={false}
            maxLength={200}
            style={styles.input}
          />
          <View style={styles.optionsWrapper}>
            <TouchableOpacity
              onPress={onCancelEdit}
              style={styles.option}
            >
              <AntDesign name="close" size={20} color={colors.dark} />
              <StyledText kalamBold>
                Cancel
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSaveEdit}
              style={styles.option}
            >
              <AntDesign name="check" size={20} color={colors.dark} />
              <StyledText kalamBold>
                Save
              </StyledText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ModalExpo>
  )
}

const styles = StyleSheet.create({
  modalBg: {
    backgroundColor: "#0008",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: 15,
    width: width * .6,
    height: height * .2,
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 50
  },
  input: {
    width: "90%",
    borderBottomColor: colors.dark,
    borderBottomWidth: 1,
    fontSize: 16
  },
  optionsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  option: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  }
})