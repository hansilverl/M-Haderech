import { useEffect, useState } from 'react'
import { ref, getDownloadURL } from 'firebase/storage'

import { storage } from '../firebase/config'

const useImageUrl = (image) => {
	const [imageUrl, setImageUrl] = useState(null)

	const fetchImageURL = async () => {
		try {	
			const imageRef = ref(storage, image)
			const url = await getDownloadURL(imageRef)
			setImageUrl(url)
		} catch(error) {
			setImageUrl(null)
		}
	}

	fetchImageURL()
	return imageUrl
}

export default useImageUrl
