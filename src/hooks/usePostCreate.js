import { useState } from 'react'
import { db } from '../firebase/config'
import { addDoc, serverTimestamp, collection } from 'firebase/firestore'

const createEmptyPost = async () => {
	const res = {
		title: 'כותרת ראשונית',
		datePublished: null,
		dateAdded: serverTimestamp(),
		description: 'תיאור הפוסט',
		published: false,
		elements: [],
	}
	return res
}

const postCreateNew = async () => {
	const newPost = await createEmptyPost()
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
			setErrorCreate(error.message)
			setPostCreateID(null)
		}
		setLoadingCreate(false)
	}

	return { postCreateID, loadingCreate, errorCreate, postCreateHandler }
}

export default usePostCreate

