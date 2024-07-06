import { useState } from 'react'

import { storage } from '../firebase/config'
import { ref, deleteObject, uploadBytes ,getDownloadURL} from 'firebase/storage'

const getDownloadURLFromPath = async (path) => {
	if (!path) return
	try {
		const storageRef = ref(storage, path)
		const url = await getDownloadURL(storageRef)
		return url
	} catch (error) {
		console.error('Error getting download URL: ', error)
	}
}

const deleteObjectByFilePath = async (url) => {
	if (!url) return
	try {
		const storageRef = ref(storage, url)
		await deleteObject(storageRef)
	} catch (error) {
		console.error('Error deleting object: ', error)
	}
}

const uploadFile = async (file, fileType) => {
	if (fileType !== 'image' && fileType !== 'pdf') throw new Error('Invalid file type')
	const date = Date.now()
	const filePath = `${fileType}s/${date}_${file.name}`
	const storageRef = ref(storage, filePath)

	await uploadBytes(storageRef, file)
	return filePath
}

const useResourceManagement = (initialPath = null) => {
	const [resourcePath, setResourcePath] = useState(initialPath)
	const [loadingResourcePath, setLoadingResourcePath] = useState(false)
	const [errorResourcePath, setErrorResourcePath] = useState(null)

	const deleteResource = async () => {
		if (!resourcePath) return
		setLoadingResourcePath(true)
		try {
			setErrorResourcePath(null)
			await deleteObjectByFilePath(resourcePath)
			setResourcePath(null)
		} catch (error) {
			setErrorResourcePath(error)
			console.error('Error deleting object: ', error)
		}
		setLoadingResourcePath(false)
	}

	const uploadResource = async (file, fileType) => {
		setLoadingResourcePath(true)
		try {
			setErrorResourcePath(null)
			const filePath = await uploadFile(file, fileType)
			setResourcePath(filePath)
		} catch (error) {
			setErrorResourcePath(error)
			console.error('Error uploading resource: ', error)
		}
		setLoadingResourcePath(false)
	}

	return {
		resourcePath,
		loadingResourcePath,
		errorResourcePath,
		deleteResource,
		uploadResource,
	}
}

export default useResourceManagement
export { deleteObjectByFilePath, getDownloadURLFromPath }
