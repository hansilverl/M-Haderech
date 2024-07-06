import { useState } from 'react'
import { db, storage } from '../firebase/config'
import { collection, doc, getDoc } from 'firebase/firestore'
import { ref, getDownloadURL } from 'firebase/storage'

const docToFrontEndDict = {
	id: 'id',
	image: 'image',
	title: 'title',
	'date-published': 'datePublished',
	'date-added': 'dateAdded',
	description: 'description',
	type: 'type',
	published: 'published',
	'content-file': 'contentFile',
	'content-html': 'contentHTML',
}
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
	const res = {}
	const keys = Object.keys(docToFrontEndDict)
	for (const key of keys) {
		if (rawData[key]) {
			res[docToFrontEndDict[key]] = rawData[key]
		}
	}
	return res
}

const postGetFromDB = async (documentID) => {
	if (!documentID) throw new Error('No document ID provided!')
	const collectionRef = collection(db, 'Posts')
	const docRef = doc(collectionRef, documentID)
	const docSnapshot = await getDoc(docRef)
	if (!docSnapshot.exists()) throw new Error('Post not found')
	const res = await convertDocToFrontEnd({ id: docSnapshot.id, ...docSnapshot.data() })
	return res
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
