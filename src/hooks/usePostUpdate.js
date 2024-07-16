import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { doc, setDoc, collection } from 'firebase/firestore'

import { fetchSinglePost } from './usePostsGet'

const postUpdateFunction = async (documentID, postChanges) => {
	if (!postChanges) throw new Error('No post provided!')
	const postsCollection = collection(db, 'Posts')
	const docRef = doc(postsCollection, documentID)
	await setDoc(docRef, postChanges, { merge: true })
	return await fetchSinglePost(documentID)
}

const usePostUpdate = (documentID) => {
	const [postUpdate, setPostUpdate] = useState(null)
	const [loadingUpdate, setLoadingUpdate] = useState(false)
	const [errorUpdate, setErrorUpdate] = useState(null)
	const [postToUpdate, setPostToUpdate] = useState(null)

	const startUpdate = (newPost) => {
		setPostToUpdate(newPost)
	}

	const postUpdateHandler = async () => {
		if (loadingUpdate) return
		setLoadingUpdate(true)
		setErrorUpdate(null)
		try {
			console.log('postToUpdate: ', postToUpdate);
			if (postToUpdate?.id) delete postToUpdate.id
			const p = await postUpdateFunction(documentID, postToUpdate)
			setPostToUpdate(null)
			setPostUpdate(p)
		} catch (error) {
			console.error('Error updating posts: ', error) // Log error for debugging
			setErrorUpdate(error.message)
			setPostUpdate(null)
		}
		setLoadingUpdate(false)
	}

	useEffect(() => {
		if (postToUpdate) {
			postUpdateHandler()
		}
	}, [postToUpdate])

	return { postUpdate, loadingUpdate, errorUpdate, startUpdate }
}

export default usePostUpdate
