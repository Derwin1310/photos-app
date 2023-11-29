import AsyncStorage from '@react-native-async-storage/async-storage'

export const setData = async (key, value) => {
  try {
    const data = JSON.stringify(value)
    await AsyncStorage.setItem(key, data)
  } catch (error) {
    console.log("Error on setData: ", error);
  }
}

export const getData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key)
    return data ? JSON.parse(data) : null;
  } catch(error) {
    console.log("Error on getData: ", error)
  }
}