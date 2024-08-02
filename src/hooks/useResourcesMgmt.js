import { useState } from 'react'

import { storage } from '../firebase/config'
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage'

const allowedFileTypes = {
	image: {
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
		webp: 'image/webp',
	},

	video: {
		mp4: 'video/mp4',
		avi: 'video/avi',
		mkv: 'video/mkv',
	},

	audio: {
		mp3: 'audio/mpeg',
		wav: 'audio/wav',
		webm: 'audio/webm',
		aac: 'audio/aac',
	},

	document: {
		pdf: 'application/pdf',
	},

	application: {
		pdf: 'application/pdf',
	},
}

const getSafeDateTimeForFileName = () => {
	const now = new Date()
	const year = now.getFullYear()
	const month = (now.getMonth() + 1).toString().padStart(2, '0')
	const day = now.getDate().toString().padStart(2, '0')
	const hours = now.getHours().toString().padStart(2, '0')
	const minutes = now.getMinutes().toString().padStart(2, '0')
	const seconds = now.getSeconds().toString().padStart(2, '0')
	const fullDate = `${year}.${month}.${day}_${hours}:${minutes}:${seconds}`
	return fullDate
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

const deleteObjectByFilePath = async (path) => {
	if (!path) return
	try {
		const storageRef = ref(storage, path)
		await deleteObject(storageRef)
	} catch (error) {
		console.error('Error deleting object: ', error)
	}
}

const uploadFile = async (file, types) => {
	if (!file) throw new Error('לא נבחר קובץ')

	if ('document' in types) types.append('application')

	const fileType = file.type.toLowerCase()
	const generalFileType = fileType.split('/')[0]
	const fileExtension = file.name.split('.').pop().toLowerCase()

	if (!types.includes('other') && !types.includes(generalFileType))
		throw new Error(`הקובץ ${file.name} אינו חוקי`)

	if (!('other' in types)) {
		const allowedTypes = allowedFileTypes[generalFileType]
		if (!allowedTypes) throw new Error('נבחר קובץ שאינו נתמך')
		if (allowedTypes[fileExtension] !== fileType) throw new Error('סוג קובץ לא תואם למבוקש')
	}

	const date = getSafeDateTimeForFileName()
	const filePath = `${generalFileType}s/${date}_${file.name}`
	const storageRef = ref(storage, filePath)

	await uploadBytes(storageRef, file)
	return filePath
}

const downloadFile = async (filePath) => {
	if (!filePath) throw new Error('לא נבחר קובץ להורדה')
	const url = await getDownloadURLFromPath(filePath)
	window.open(url, '_blank')
}

const useResourcesMgmt = (initialList = null) => {
	const [resourceList, setResourceList] = useState(initialList ? initialList : [])
	const [loadingResourcesMgmt, setLoadingResourceMgmt] = useState(false)
	const [errorResourcesMgmt, setErrorResourceMgmt] = useState(null)

	const deleteResources = async (paths) => {
		if (!paths || loadingResourcesMgmt) return
		setLoadingResourceMgmt(true)
		setErrorResourceMgmt(null)
		for (const path of paths) {
			try {
				if (!path || !resourceList.includes(path))
					throw new Error('לא נבחר קובץ למחיקה או שהקובץ אינו מנוהל על ידי רכיב זה')
				await deleteObjectByFilePath(path)
				setResourceList((resourceList) => resourceList.filter((p) => p !== path))
			} catch (error) {
				setErrorResourceMgmt((msg) => `${msg}\n${error.message}`)
				console.error('Error deleting object: ', error)
			}
		}
		setLoadingResourceMgmt(false)
	}

	const uploadResources = async (newFiles, allowedTypes) => {
		if (!newFiles || loadingResourcesMgmt) return
		setLoadingResourceMgmt(true)
		setErrorResourceMgmt(null)
		const filePaths = []
		for (const file of newFiles) {
			try {
				const filePath = await uploadFile(file, allowedTypes)
				filePaths.push(filePath)
			} catch (error) {
				setErrorResourceMgmt(error.message)
				console.error('Error uploading resource: ', error)
			}
		}
		setResourceList((paths) => [...paths, ...filePaths])
		setLoadingResourceMgmt(false)
	}

	const downloadResource = async (path) => {
		if (!resourceList || loadingResourcesMgmt) return
		setLoadingResourceMgmt(true)
		try {
			setErrorResourceMgmt(null)
			if (!path || !(path in resourceList))
				throw new Error('לא נבחר קובץ או שהקובץ אינו ברשימה של רכיב זה')
			await downloadFile(path)
		} catch (error) {
			setErrorResourceMgmt(error.message)
			console.error('Error downloading resource: ', error)
		}
		setLoadingResourceMgmt(false)
	}

	return {
		resourceList,
		loadingResourcesMgmt,
		errorResourcesMgmt,
		deleteResources,
		uploadResources,
		downloadResource,
	}
}

export default useResourcesMgmt
export { deleteObjectByFilePath, getDownloadURLFromPath }
