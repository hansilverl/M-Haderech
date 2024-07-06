import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, query, orderBy, limit } from 'firebase/firestore'
import { postsFetchByQuery } from './usePostsGetMultiple'

const usePostsGetAdmin = (lim = 3) => {
	const [postsGetAdmin, setPosts] = useState(null)
	const [loadingGetAdmin, setLoading] = useState(true)
	const [errorGetAdmin, setError] = useState(null)

	const postsGetAdminHandler = async (lim) => {
		setLoading(true)
		try {
			const q = query(collection(db, 'Posts'), orderBy('date-added', 'desc'), limit(lim))
			const postsFetched = await postsFetchByQuery(q)
			setPosts(postsFetched)
		} catch (error) {
			console.error('Error fetching posts: ', error) // Log error for debugging
			setError(error)
		}
		setLoading(false)
		return postsGetAdmin
	}

	return { postsGetAdmin, loadingGetAdmin, errorGetAdmin, postsGetAdminHandler }
}

export default usePostsGetAdmin
