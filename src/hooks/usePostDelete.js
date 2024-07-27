import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { doc, deleteDoc, collection } from 'firebase/firestore'

import { deleteObjectByFilePath } from './useResourcesMgmt'
import { fetchSinglePost } from './usePostsGet'
import { elements } from 'chart.js'

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
	const post = await fetchSinglePost(documentID)
	if (!post) throw new Error('Post not found')

	post.elements.forEach(async (element) => {
		await deleteObjectByFilePath(element.resourcePath)
	})

	await deleteDocByReference(docRef)
	return post
}

const usePostDelete = (documentID) => {
	const [postDelete, setPostDelete] = useState(null)
	const [loadingDelete, setLoadingDelete] = useState(false)
	const [errorDelete, setErrorDelete] = useState(null)
	const [load, setLoad] = useState(false)

	const startDelete = () => {
		setLoad(true)
	}

	const postDeleteHandler = async () => {
		if (loadingDelete) return
		setLoadingDelete(true)
		try {
			const p = await postDeleteFunction(documentID)
			setPostDelete(p)
		} catch (error) {
			console.error('Error deleting posts: ', error) // Log error for debugging
			setErrorDelete(error.message)
			setPostDelete(null)
		}
		setLoadingDelete(false)
		return postDelete
	}

	useEffect(() => {
		if (load) {
			setLoad(false)
			postDeleteHandler()
		}
	}, [load])

	return { postDelete, loadingDelete, errorDelete, startDelete }
}

export default usePostDelete
