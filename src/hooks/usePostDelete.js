import { useState } from 'react'
import { db, storage } from '../firebase/config'
import { doc, deleteDoc, getDoc, addDoc, getDocs, query, limit } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'

import { postGetFromDB } from './usePostGet'


const deleteObjectByReference = async (ref) => {
	if (!ref) return
	try {
		await deleteObject(ref)
	} catch (error) {
		console.error('Error deleting object: ', error)
	}
}

const deleteDocByReference = async (ref) => {
	if (!ref) return
	try {
		await deleteDoc(ref)
	} catch (error) {
		console.error('Error deleting document: ', error)
	}
}

const postDelete = async (documentID) => {
	if (!documentID) throw new Error('No document ID provided!')
	const docRef = doc(db, 'Posts', documentID)
	const post = await postGetFromDB(documentID)
	if (!post) throw new Error('Post not found')

	const contentRef = post.contentFile ? ref(storage, post.contentFile) : null
	const imageRef = post.image ? ref(storage, post.image) : null
	console.log(post['content-file'], post['image'])

	await deleteObjectByReference(contentRef)
	await deleteObjectByReference(imageRef)
	await deleteDocByReference(docRef)

	return post
}

const usePostDelete = (documentID) => {
	const [post, setPost] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const postDeleteHandler = async (documentID) => {
		setLoading(true)
		setError(null)
		try {
			const p = await postDelete(documentID)
			setPost(p)
		} catch (error) {
			console.error('Error deleting posts: ', error) // Log error for debugging
			setError(error)
			setPost(null)
		}
		setLoading(false)
		return post
	}

	return { post, loading, error, postDeleteHandler }
}

export default usePostDelete