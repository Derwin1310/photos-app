import { useContext } from "react"
import { shareAsync } from "expo-sharing"
import { store } from "../context/store"
import { setData } from "../helpers/storage"

export const useImgOptions = (img) => {
  const {
    loadData,
    effects: {
      setGalleryImg,
      setIsModalVisible,
      setInputText,
      setEditItem,
      setLoadData
    }
} = useContext(store)

  const shareImage = async () => {
    try {
      await shareAsync(img)
    } catch (error) {
      console.log("Error on shareImage: ",error)
    }
  }

  const deleteImage = async (itemToDelete) => {
    const newImagesList = loadData.filter(item => item.image !== itemToDelete)
    await setData("galleryList", newImagesList)
    setLoadData(newImagesList)
  }

  const editImage = (description) => {
    setIsModalVisible(true)
    setInputText(description)
    setEditItem(img)
  }
  return {
    shareImage,
    deleteImage,
    editImage
  }
}
