import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { convertDocToFrontEnd } from '../hooks/usePostDetails'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'

const usePostsDetails = (lim = 3) => {
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchPosts = async (lim) => {
		try {
			const q = query(
				collection(db, 'Posts'),
				orderBy('date-published', 'desc'),
				where('published', '==', true),
				limit(lim)
			)

			const querySnapshot = await getDocs(q)
			const rawData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
			const fixedData = []
			for (const post of rawData) {
				fixedData.push(await convertDocToFrontEnd(post))
			}
			setPosts(fixedData)
		} catch (error) {
			console.error('Error fetching posts: ', error) // Log error for debugging
			setError(error)
		}
		setLoading(false)
	}

	useEffect(() => {
		fetchPosts(lim)
	}, [lim])

	return { posts, loading, error }
}

export default usePostsDetails
