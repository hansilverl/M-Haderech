import { useState, useEffect } from 'react'
import { db, collectionNames } from '../firebase/config'
import { getDownloadURLFromPath } from './useResourceManagement'
import {
	collection,
	query,
	where,
	orderBy,
	limit,
	getDocs,
	getDoc,
	doc,
	startAfter,
	startAt,
} from 'firebase/firestore'

const DEFAULT_LIMIT = 20

const addFileUrls = async (post) => {
	const { elements } = post
	if (!elements) return
	for (const element of elements) {
		if (element.resourcePath) {
			element.resourceUrl = await getDownloadURLFromPath(element.resourcePath)
		}
	}
}

const convertDocToPost = async (doc) => {
	const post = { id: doc.id, ...doc.data() }
	await addFileUrls(post)
	return post
}

const convertDocsToPosts = async (docs) => {
	const posts = await Promise.all(docs.map(async (doc) => await convertDocToPost(doc)))
	await Promise.all(posts.map(async (post) => await addFileUrls(post)))
	return posts.length > 0 ? posts : null
}

const fetchSinglePost = async (documentID) => {
	const col = collection(db, collectionNames.posts)
	const docRef = doc(col, documentID)
	const docSnap = await getDoc(docRef)
	if (!docSnap.exists()) throw new Error('לא נמצא מאמר עם המזהה המתאים')
	const post = await convertDocToPost(docSnap)
	return post
}

const getNextFetch = async (firebaseQuery, fetchedDocs) => {
	if (!firebaseQuery || !fetchedDocs || fetchedDocs.length === 0) return null
	if (firebaseQuery._query.limit < fetchedDocs.length) return null

	const modifiedQuery = query(
		firebaseQuery,
		startAfter(fetchedDocs[fetchedDocs.length - 1]),
		limit(1)
	)
	const querySnapshot = await getDocs(modifiedQuery)

	if (querySnapshot.docs.length === 0) return null
	return querySnapshot.docs[0]
}
const usePostsGet = (firebaseQuery) => {
	const [postsGet, setPosts] = useState(null)
	const [loadingGet, setLoading] = useState(false)
	const [errorGet, setError] = useState(null)

	const [hasMore, setHasMore] = useState(false)
	const [lastFetch, setLastFetch] = useState(null)
	const [loadMore, setLoadMore] = useState(false)
	const [reload, setReload] = useState(true)

	const reloadGet = () => {
		setReload(true)
	}

	const loadMoreGet = () => {
		setLoadMore(true)
	}

	const postsGetHandler = async (isLoadMore) => {
		if (loadingGet) return
		setLoading(true)
		setError(null)

		try {
			if (isLoadMore && (!hasMore || !lastFetch)) throw new Error('אין עוד מאמרים')

			if (!firebaseQuery) throw new Error('לא התקבלה שאילתה!')
			if (typeof firebaseQuery === 'string') {
				const fetchedPost = await fetchSinglePost(firebaseQuery)
				setPosts(fetchedPost)
			} else {
				let modifiedQuery = firebaseQuery
				if (isLoadMore && hasMore) modifiedQuery = query(firebaseQuery, startAt(lastFetch))

				const docsSnapshot = await getDocs(modifiedQuery)
				const nextFetch = await getNextFetch(modifiedQuery, docsSnapshot.docs)
				const fetchedPosts = await convertDocsToPosts(docsSnapshot.docs)

				if (isLoadMore && hasMore) setPosts((prevPosts) => [...prevPosts, ...fetchedPosts])
				else setPosts(fetchedPosts)

				if (nextFetch) {
					setLastFetch(nextFetch)
					setHasMore(true)
				} else {
					setLastFetch(null)
					setHasMore(false)
				}
			}
		} catch (error) {
			console.error('Error fetching posts: ', error) // Log error for debugging
			setError(error.message)
		}

		setLoading(false)
	}

	useEffect(() => {
		if (reload) {
			setReload(false)
			setLoadMore(false)
			postsGetHandler(false)
		}
		if (loadMore) {
			setReload(false)
			setLoadMore(false)
			postsGetHandler(true)
		}
	}, [reload, loadMore])

	return { postsGet, loadingGet, errorGet, hasMore, reloadGet, loadMoreGet }
}

const buildQuery = (type, published, amount = DEFAULT_LIMIT) => {
	let q = query(collection(db, collectionNames.posts))

	if (type) q = query(q, where('articleType', '==', type))

	if (published) q = query(q, where('published', '==', true), orderBy('datePublished', 'desc'))
	else q = query(q, orderBy('dateAdded', 'desc'))

	if (amount > 0) q = query(q, limit(amount))
	return q
}

export default usePostsGet

export { buildQuery, fetchSinglePost }
