import { useState } from 'react'
import { db, storage } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { ref, getDownloadURL } from 'firebase/storage'

const fetchResourceURL = async (resource) => {
	if (!resource) return null
	try {
		const contentFileRef = ref(storage, resource)
		const url = await getDownloadURL(contentFileRef)
		return url
	} catch (error) {
		console.error('Error fetching resource URL: ', error)
	}
	return null
}
const convertDocToFrontEnd = async (rawData) => {
	const res = {
		id: rawData.id,
		image: await fetchResourceURL(rawData['image']),
		title: rawData['title'],
		datePublished: rawData['date-published'],
		dateAdded: rawData['date-added'],
		description: rawData['description'],
		type: rawData['type'],
		published: rawData['published'],
		contentFile: await fetchResourceURL(rawData['content-file']),
		contentHTML: rawData['content-html'],
	}
	return res
}

const postGetFromDB = async (documentID) => {
	if (!documentID) throw new Error('No document ID provided!')
	const docRef = doc(db, 'Posts', documentID)
	const docSnapshot = await getDoc(docRef)
	if (docSnapshot.exists()) throw new Error('Post not found')
	return await convertDocToFrontEnd({ id: docSnapshot.id, ...docSnapshot.data() })
}

const usePostGet = () => {
	const [postGet, setPostGet] = useState(null)
	const [loadingGet, setLoadingGet] = useState(false)
	const [errorGet, setErrorGet] = useState(null)

	const postGetHandler = async (documentID) => {
		try {
			if (!documentID) throw new Error('No document ID provided!')
			setLoadingGet(true)
			setPostGet(null)
			setErrorGet(null)
			const p = await postGetFromDB(documentID)
			setPostGet(p)
		} catch (error) {
			console.error('Error fetching posts: ', error) // Log error for debugging
			setErrorGet(error)
			setPostGet(null)
		}
		setLoadingGet(false)
	}

	return { postGet, loadingGet, errorGet, postGetHandler }
}

export default usePostGet

export { postGetFromDB, convertDocToFrontEnd }
