import { useState, useEffect } from 'react'
import { db, storage } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'

const fetchResourceURL = async (resource) => {
	if (!resource) return null
	try {
		const contentFileRef = ref(storage, resource)
		const url = await getDownloadURL(contentFileRef)
		return url
	} catch (error) {
		console.error('Error fetching resource URL: ', error)
	}
	return null
}
const convertDocToFrontEnd = async (rawData) => {
	const res = {
		id: rawData.id,
		image: await fetchResourceURL(rawData['image']),
		title: rawData['title'],
		datePublished: rawData['date-published'],
		dateAdded: rawData['date-added'],
		description: rawData['description'],
		type: rawData['type'],
		published: rawData['published'],
		contentFile: await fetchResourceURL(rawData['content-file']),
		contentHTML: rawData['content-html'],
	}
	return res
}

const usePostDetails = (documentID) => {
	const [post, setPost] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchPost = async (documentID) => {
		try {
			if (!documentID) {
				setLoading(false)
				setError('No such document!')
				return
			}
			const docRef = doc(db, 'Posts', documentID)
			const docSnapshot = await getDoc(docRef)
			if (!docSnapshot.exists()) {
				setPost(null)
				throw new Error('Post not found')
			}
			const res = await convertDocToFrontEnd({ id: docSnapshot.id, ...docSnapshot.data() })
			setPost(res)
		} catch (error) {
			console.error('Error fetching posts: ', error) // Log error for debugging
			setError(error)
			setPost(null)
		}
		setLoading(false)
	}

	useEffect(() => {
		fetchPost(documentID)
	}, [documentID])

	return { post, loading, error }
}

export default usePostDetails
export { convertDocToFrontEnd }
