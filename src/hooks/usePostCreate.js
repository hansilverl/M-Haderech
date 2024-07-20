import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { addDoc, serverTimestamp, collection } from 'firebase/firestore'

const createEmptyPost = async (type) => {
	const res = {
		title: 'כותרת ראשונית',
		datePublished: null,
		dateAdded: serverTimestamp(),
		description: '',
		published: false,
		articleType: type,
		elements: [],
	}
	return res
}

const postCreateNew = async (type) => {
	const newPost = await createEmptyPost(type)
	const collectionRef = collection(db, 'Posts')
	const docRef = await addDoc(collectionRef, newPost)
	const docID = docRef.id
	return docID
}

const usePostCreate = () => {
	const [postCreateID, setPostCreateID] = useState(null)
	const [loadingCreate, setLoadingCreate] = useState(false)
	const [errorCreate, setErrorCreate] = useState(null)
	const [load, setLoad] = useState(false)
	const [type, setType] = useState(null)

	const startCreate = (type) => {
		if (type !== 'convention' && type !== 'post') return
		setType(type)
		setLoad(true)
	}

	const postCreateHandler = async () => {
		if (loadingCreate) return
		setLoadingCreate(true)
		setErrorCreate(null)
		try {
			if (type !== 'convention' && type !== 'post') throw new Error('Invalid post type')
			const docID = await postCreateNew(type)
			setPostCreateID(docID)
		} catch (error) {
			console.error('Error creating post: ', error)
			setErrorCreate(error.message)
			setPostCreateID(null)
		}
		setType(null)
		setLoadingCreate(false)
	}

	useEffect(() => {
		if (load && type) {
			setLoad(false)
			postCreateHandler()
		}
	}, [load, type])

	return { postCreateID, loadingCreate, errorCreate, startCreate }
}

export default usePostCreate
