import { useState } from 'react'
import { db, storage } from '../firebase/config'
import { doc, deleteDoc, getDoc, addDoc, getDocs, query, limit, setDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { convertFrontEndToDoc } from './usePostCreate'


const postUpdate = async (documentID, post) => {
	if (!post) throw new Error('No post provided!')
	const newPost = await convertFrontEndToDoc(post)
	const docRef = await getDoc(db, 'Posts', documentID)
	await setDoc(docRef, newPost, { merge: true })
	return documentID
}

const usePostUpdate = () => {
	const [postUpdate, setPostUpdate] = useState(null)
	const [loadingUpdate, setLoadingUpdate] = useState(false)
	const [errorUpdate, setErrorUpdate] = useState(null)

	const postUpdateHandler = async (documentID, newPost) => {
		setLoadingUpdate(true)
		setErrorUpdate(null)

		try {
			const p = await postUpdate(documentID, newPost)
			setPostUpdate(p)
		} catch (error) {
			console.error('Error updating posts: ', error) // Log error for debugging
			setErrorUpdate(error)
			setPostUpdate(null)
		}
		setLoadingUpdate(false)
	}

	return [postUpdate, loadingUpdate, errorUpdate, postUpdateHandler]
}

export default usePostUpdate
