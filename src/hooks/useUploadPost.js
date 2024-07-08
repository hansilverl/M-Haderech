import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { doc, getDoc, updateDoc, addDoc } from 'firebase/firestore'

const isPostValid = (post) => {
	if (!post.title || !post.type || !post.description) {
		return false
	}
	if (post.type != 'editor' || post.type != 'file') {
		return false
	}
	if (post.type == 'editor' && !post.contentHTML) {
		return false
	}
	if (post.type == 'file' && !post.contentFile) {
		return false
	}
	return true
}

const useUploadPost = (post) => {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const uploadPost = async () => {
		if (!isPostValid(post)) {
			setLoading(false)
			setError('חובה למלא את כל השדות')
			return
		}
		try {
			await addDoc(db.collection('Posts'), post)
			setLoading(false)
		} catch (err) {
			console.error('Error uploading post: ', err) // Log error for debugging
			setError(err)
			setLoading(false)
		}
	}

	return { loading, error, uploadPost }
}

export default useUploadPost
