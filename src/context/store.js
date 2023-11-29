import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useRef, useState } from 'react';
import { getData } from '../helpers/storage';

export const store = createContext();

export const AppContext = ({ children }) => {
  const [listTitle, setListTitle] = useState("")
  const [galleryImg, setGalleryImg] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [inputText, setInputText] = useState("")
  const [editItem, setEditItem] = useState("")
  const [loadData, setLoadData] = useState(null)
  const myListRef = useRef()

  const loadPhotosList = async () => {
    try {
      const localData = await getData("galleryList")
      setLoadData(localData)
    } catch (error) {
      console.log("Error on loadPhotosList: ", error)
    }
  }

  const goTop = () => {
    myListRef.current.scrollToIndex({ index: 0 })
  }

  const INITIAL_STATE = {
    listTitle,
    myListRef,
    galleryImg,
    isModalVisible,
    inputText,
    editItem,
    loadData
  }

  const setState = () => {
    return {
      setListTitle,
      goTop,
      setGalleryImg,
      setIsModalVisible,
      setInputText,
      setEditItem,
      loadPhotosList,
      setLoadData
    }
  }

  const state = {
    ...INITIAL_STATE,
    effects: {
      ...setState()
    }
  }
  return <store.Provider value={state}>{children}</store.Provider>
}