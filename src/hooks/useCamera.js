import { useContext, useRef, useState } from 'react'
import { Camera, CameraType } from 'expo-camera'
import { createAssetAsync } from 'expo-media-library'
import { store } from '../context/store'
import { getData, setData } from '../helpers/storage'

export const useCamera = () => {
	const {
		isModalVisible,
		inputText,
		galleryImg,
		effects: {
			setGalleryImg,
			setIsModalVisible,
			setInputText,
		},
	} = useContext(store)

	const [type, setType] = useState(CameraType.back)
	const [image, setImage] = useState(null)
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)

	const cameraRef = useRef(null)

	const cameraFlash = Camera.Constants.FlashMode

	const takePicture = async () => {
		if (cameraRef) {
			try {
				const { uri } = await cameraRef.current.takePictureAsync()
				setImage(uri)
			} catch (error) {
				console.log('Error on takePicture :', error)
			}
		}
	}

	const saveImage = async () => {
		if (image) {
			try {
				await createAssetAsync(image)
				const newData = await getData('galleryList') || galleryImg
        const newGalleryImg = [{ desc: inputText, image }, ...newData]
				setGalleryImg(newGalleryImg)
				await setData('galleryList', newGalleryImg)
				setImage(null)
			} catch (error) {
				console.log('Error on saveImage :', error)
			}
		}
	}

	const addDescription = () => {
		setIsModalVisible(!isModalVisible)
		setInputText('')
	}

	const deleteImage = () => setImage(null)

	const toggleCameraType = () =>
		setType(type === CameraType.back ? CameraType.front : CameraType.back)

	const toggleCameraFlash = () =>
		setFlash(flash === cameraFlash.off ? cameraFlash.torch : cameraFlash.off)

	return {
		addDescription,
		takePicture,
		deleteImage,
		saveImage,
		toggleCameraFlash,
		toggleCameraType,
		image,
		type,
		flash,
		cameraRef,
	}
}
