import { useState } from 'react'

import { storage } from '../firebase/config'
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage'

const allowedFileTypes = {
	image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
	video: ['video/mp4', 'video/avi', 'video/mkv'],
	audio: ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/mp3', 'audio/aac'],
	pdf: ['application/pdf'],
	other: ['*/*'],
}

const allowedFileExtensions = {
	image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
	video: ['mp4', 'avi', 'mkv'],
	audio: ['mp3', 'wav', 'webm', 'aac'],
	pdf: ['pdf'],
	other: ['*'],
}

const getSafeDateTimeForFileName = () => {
	const now = new Date()
	const year = now.getFullYear()
	const month = (now.getMonth() + 1).toString().padStart(2, '0')
	const day = now.getDate().toString().padStart(2, '0')
	const hours = now.getHours().toString().padStart(2, '0')
	const minutes = now.getMinutes().toString().padStart(2, '0')
	const seconds = now.getSeconds().toString().padStart(2, '0')
	return `${year}.${month}.${day}_${hours}:${minutes}:${seconds}`
}
const getDownloadURLFromPath = async (path) => {
	if (!path) return null
	try {
		const storageRef = ref(storage, path)
		const url = await getDownloadURL(storageRef)
		return url
	} catch (error) {
		console.error('Error getting download URL: ', error)
	}
	return ''
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

const uploadFile = async (file, type) => {
	if (!file) throw new Error('לא נבחר קובץ')

	const allowedType = allowedFileTypes[type]
	const allowedExtension = allowedFileExtensions[type]
	if (!allowedType || !allowedExtension) throw new Error('לא נבחר סוג קובץ אפשרי')

	const fileType = file.type
	const fileExtension = file.name.split('.').pop()

	if (!fileType === 'other') {
		if (!allowedType.includes(fileType)) throw new Error('סוג קובץ לא תואם למבוקש')
		if (!allowedExtension.includes(fileExtension)) throw new Error('סוג קובץ לא תואם למבוקש')
	}

	const date = getSafeDateTimeForFileName()
	const filePath = `${type}s/${date}_${file.name}`
	const storageRef = ref(storage, filePath)

	await uploadBytes(storageRef, file)
	return filePath
}

const downloadFile = async (filePath) => {
	if (!filePath) throw new Error('Invalid file path')
	const url = await getDownloadURLFromPath(filePath)

	window.open(url, '_blank')
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
			setErrorResourcePath(error.message)
			console.error('Error deleting object: ', error)
		}
		setLoadingResourcePath(false)
	}

	const uploadResource = async (file, type) => {
		setLoadingResourcePath(true)
		try {
			setErrorResourcePath(null)
			const filePath = await uploadFile(file, type)
			setResourcePath(filePath)
		} catch (error) {
			setErrorResourcePath(error.message)
			console.error('Error uploading resource: ', error)
		}
		setLoadingResourcePath(false)
	}

	const downloadResource = async () => {
		if (!resourcePath) return
		setLoadingResourcePath(true)
		try {
			setErrorResourcePath(null)
			await downloadFile(resourcePath)
		} catch (error) {
			setErrorResourcePath(error.message)
			console.error('Error downloading resource: ', error)
		}
		setLoadingResourcePath(false)
	}

	return {
		resourcePath,
		loadingResourcePath,
		errorResourcePath,
		deleteResource,
		uploadResource,
		downloadResource,
	}
}

export default useResourceManagement
export { deleteObjectByFilePath, getDownloadURLFromPath }
