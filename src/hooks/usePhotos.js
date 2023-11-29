import { useState } from "react"

export const usePhotos = (fetchList, ...props) => {
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const loadPhotosCollection = async () => {
    try {
      setLoading(true)
      const results = await fetchList(currentPage, props)
      setPhotos([...photos, ...results])
      setLoading(false)
    } catch (error) {
      console.log("error on usePhotos :", error)
    }
  }

  const loadPhotos = () => setCurrentPage(page => page + 1)

  return {
    photos,
    currentPage,
    loading,
    loadPhotos,
    loadPhotosCollection
  }
}
