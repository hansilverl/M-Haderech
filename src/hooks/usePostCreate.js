import { useState } from 'react'
import { db, storage } from '../firebase/config'
import { addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'

const createEmptyPost = async () => {
	const res = {
		image: null,
		title: '',
		datePublished: null,
		dateAdded: serverTimestamp(),
		description: 'תיאור הפוסט',
		type: null,
		published: false,
		contentFile: null,
		contentHTML: null,
	}
	return res
}

const convertFrontEndToDoc = async (rawData) => {
	const res = {
		image: rawData.image,
		title: rawData.title,
		'date-published': rawData.datePublished,
		'date-added': rawData.dateAdded,
		description: rawData.description,
		type: rawData.type,
		published: rawData.published,
		'content-file': rawData.contentFile,
		'content-html': rawData.contentHTML,
	}
	return res
}

const postCreateNew = async () => {
	const post = await createEmptyPost()
	const newPost = await convertFrontEndToDoc(post)
	const docRef = await addDoc(db, 'Posts', newPost)
	const docID = docRef.id
	return docID
}

const usePostCreate = () => {
	const [postCreateID, setPostCreate] = useState(null)
	const [loadingCreate, setLoadingCreate] = useState(false)
	const [errorCreate, setErrorCreate] = useState(null)

	const postCreateHandler = async () => {
		setLoadingCreate(true)
		setErrorCreate(null)
		try {
			const docID = await postCreateNew()
			setPostCreate(docID)
		} catch (error) {
			console.error('Error creating post: ', error)
			setErrorCreate(error)
			setPostCreate(null)
		}
		setLoadingCreate(false)
	}

	return { postCreateID, loadingCreate, errorCreate, postCreateHandler }
}

export default usePostCreate

export { convertFrontEndToDoc }
