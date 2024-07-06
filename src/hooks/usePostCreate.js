import { useState } from 'react'
import { db } from '../firebase/config'
import { addDoc, serverTimestamp, collection } from 'firebase/firestore'

const frontEndToDocDict = {
	image: 'image',
	title: 'title',
	datePublished: 'date-published',
	dateAdded: 'date-added',
	description: 'description',
	type: 'type',
	published: 'published',
	contentFile: 'content-file',
	contentHTML: 'content-html',
}

const createEmptyPost = async () => {
	const res = {
		image: null,
		title: 'כותרת ראשונית',
		datePublished: null,
		dateAdded: serverTimestamp(),
		description: 'תיאור הפוסט',
		type: 'editor',
		published: false,
		contentFile: null,
		contentHTML: '',
	}
	return res
}

const convertFrontEndToDoc = async (rawData) => {
	const res = {}
	const keys = Object.keys(frontEndToDocDict)
	for (const key of keys) {
		if (rawData[key] === null || rawData[key] === undefined) continue
		res[frontEndToDocDict[key]] = rawData[key]
	}
	return res
}

const postCreateNew = async () => {
	const post = await createEmptyPost()
	const newPost = await convertFrontEndToDoc(post)
	console.log('newPost', newPost)
	const collectionRef = collection(db, 'Posts')
	const docRef = await addDoc(collectionRef, newPost)
	const docID = docRef.id
	return docID
}

const usePostCreate = () => {
	const [postCreateID, setPostCreateID] = useState(null)
	const [loadingCreate, setLoadingCreate] = useState(false)
	const [errorCreate, setErrorCreate] = useState(null)

	const postCreateHandler = async () => {
		setLoadingCreate(true)
		setErrorCreate(null)
		try {
			const docID = await postCreateNew()
			setPostCreateID(docID)
		} catch (error) {
			console.error('Error creating post: ', error)
			setErrorCreate(error)
			setPostCreateID(null)
		}
		setLoadingCreate(false)
	}

	return { postCreateID, loadingCreate, errorCreate, postCreateHandler }
}

export default usePostCreate

export { convertFrontEndToDoc }
