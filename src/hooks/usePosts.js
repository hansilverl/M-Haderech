import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

const usePosts = () => {
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true) // Ensure loading state is true at the start of fetch
			try {
				const querySnapshot = await getDocs(collection(db, 'Posts'))
				const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) // Include document ID if needed
				console.log(data)
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

export default usePosts
