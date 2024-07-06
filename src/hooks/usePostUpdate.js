import { useState } from 'react'
import { db } from '../firebase/config'
import { doc, setDoc, collection } from 'firebase/firestore'

const postUpdateFunction = async (documentID, postChanges) => {
	if (!postChanges) throw new Error('No post provided!')
	const postsCollection = collection(db, 'Posts')
	const docRef = doc(postsCollection, documentID)
	await setDoc(docRef, postChanges, { merge: true })
	return documentID
}

const usePostUpdate = (documentID) => {
	const [postUpdate, setPostUpdate] = useState(null)
	const [loadingUpdate, setLoadingUpdate] = useState(false)
	const [errorUpdate, setErrorUpdate] = useState(null)

	const postUpdateHandler = async (newPost) => {
		if(!documentID) return
		setLoadingUpdate(true)
		setErrorUpdate(null)
		try {
			if (newPost?.id) delete newPost.id
			const p = await postUpdateFunction(documentID, newPost)
			setPostUpdate(p)
		} catch (error) {
			console.error('Error updating posts: ', error) // Log error for debugging
			setErrorUpdate(error)
			setPostUpdate(null)
		}
		setLoadingUpdate(false)
	}

	return { postUpdate, loadingUpdate, errorUpdate, postUpdateHandler }
}

export default usePostUpdate
