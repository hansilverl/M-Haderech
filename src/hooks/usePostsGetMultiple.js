import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { addFileUrls } from './usePostGet'
const postsFetchByQuery = async (query) => {
	const querySnapshot = await getDocs(query)
	const rawData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
	const posts = []
	for (const post of rawData) {
		console.log(post);
		await addFileUrls(post)
		posts.push(post)
	}
	return posts
}
const usePostsGetMultiple = (lim = 3) => {
	const [postsGetMultiple, setPosts] = useState([])
	const [loadingGetMultiple, setLoading] = useState(true)
	const [errorGetMultiple, setError] = useState(null)

	const postsGetMultipleHandler = async (lim) => {
		try {
			const q = query(
				collection(db, 'Posts'),
				orderBy('datePublished', 'desc'),
				where('published', '==', true),
				limit(lim)
			)
			const fetchedPosts = await postsFetchByQuery(q)

			setPosts(fetchedPosts)
		} catch (error) {
			console.error('Error fetching posts: ', error) // Log error for debugging
			setError(error)
		}
		setLoading(false)
	}

	useEffect(() => {
		postsGetMultipleHandler(lim)
	}, [lim])

	return { postsGetMultiple, loadingGetMultiple, errorGetMultiple }
}

export default usePostsGetMultiple

export { postsFetchByQuery }
