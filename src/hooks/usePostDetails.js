import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { storage, collection, doc, getDoc } from 'firebase/firestore'
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
const convertDocToFrontEnd = async (docSnapshot) => {
	const docData = docSnapshot.data()
	const res = {
		id: docSnapshot.id,
		image: docData['image'],
		title: docData['title'],
		datePublished: docData['date-published'],
		dateAdded: docData['date-added'],
		description: docData['description'],
		type: docData['type'],
		contentFile: docData['content-file'],
		published: docData['published'],
		contentHTML: docData['content-html'],
	}
	res.image = await fetchResourceURL(res.image)
	res.contentFile = await fetchResourceURL(res.contentFile)
	return res
}
const usePostDetails = (documentID) => {
	const [post, setPost] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchPosts = async () => {
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
			const res = await convertDocToFrontEnd(docSnapshot)
			setPost(res)
		} catch (error) {
			console.error('Error fetching posts: ', error) // Log error for debugging
			setError(error)
			setPost(null)
		}
		setLoading(false)
	}

	useEffect(() => {
		fetchPosts()
	}, [])

	return { post, loading, error }
}

export default usePostDetails
export { convertDocToFrontEnd }
