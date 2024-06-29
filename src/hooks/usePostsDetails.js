import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs, query, where, orderBy , limit } from 'firebase/firestore'

const usePostsDetails = (lim = 3) => {
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true) // Ensure loading state is true at the start of fetch
			try {
				const q = query(
					collection(db, 'Posts'),
					orderBy('date-published', 'desc'),
					where('published', '==', true),
					limit(lim)
				)
				const querySnapshot = await getDocs(q)
				const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) // Include document ID if needed
				setPosts(data)
				setLoading(false)
			} catch (error) {
				console.error('Error fetching posts: ', error) // Log error for debugging
				setError(error)
				setLoading(false)
			}
		}
		fetchPosts()
	}, [])

	return { posts, loading, error }
}

export default usePostsDetails
