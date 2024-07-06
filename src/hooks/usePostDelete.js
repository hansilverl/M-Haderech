import { useState } from 'react'
import { db, storage } from '../firebase/config'
import { doc, deleteDoc, collection } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'

import {  deleteObjectByFilePath } from './useResourceManagement'
import { postGetFromDB } from './usePostGet'

const deleteDocByReference = async (ref) => {
	if (!ref) return
	try {
		await deleteDoc(ref)
	} catch (error) {
		console.error('Error deleting document: ', error)
	}
}

const postDeleteFunction = async (documentID) => {
	if (!documentID) throw new Error('No document ID provided!')
	const postsCollection = collection(db, 'Posts')
	const docRef = doc(postsCollection, documentID)
	const post = await postGetFromDB(documentID)
	if (!post) throw new Error('Post not found')

	await deleteObjectByFilePath(post.contentFile)
	await deleteObjectByFilePath(post.imageUrl)
	await deleteDocByReference(docRef)

	return post
}

const usePostDelete = (documentID) => {
	const [postDelete, setPostDelete] = useState(null)
	const [loadingDelete, setLoadingDelete] = useState(false)
	const [errorDelete, setErrorDelete] = useState(null)

	const postDeleteHandler = async () => {
		console.log('deleting', documentID)
		setLoadingDelete(true)
		try {
			const p = await postDeleteFunction(documentID)
			setPostDelete(p)
		} catch (error) {
			console.error('Error deleting posts: ', error) // Log error for debugging
			setErrorDelete(error)
			setPostDelete(null)
		}
		setLoadingDelete(false)
		return postDelete
	}

	return { postDelete, loadingDelete, errorDelete, postDeleteHandler }
}

export default usePostDelete
