import { useState, useEffect } from 'react'
import { db, collectionNames } from '../firebase/config'
import { getDownloadURLFromPath } from './useResourceManagement'
import { collection, query, where, orderBy, limit, getDocs, getDoc, doc } from 'firebase/firestore'

const addFileUrls = async (post) => {
	const { elements } = post
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

const postsFetchByQuery = async (query) => {
	if (!query && typeof query !== 'string' && typeof query !== 'object') return

	if (typeof query === 'string') {
		const col = collection(db, collectionNames.posts)
		const docRef = doc(col, query)
		const docSnap = await getDoc(docRef)
		if (!docSnap.exists()) throw new Error('לא נמצא פוסט עם המזהה המתאים')
		const post = await convertDocToPost(docSnap)
		addFileUrls(post)
		return post
	}

	const querySnapshot = await getDocs(query)
	const rawData = await Promise.all(
		querySnapshot.docs.map(async (doc) => await convertDocToPost(doc))
	)
	if (rawData.length === 0) throw new Error('לא נמצאו פוסטים')

	const posts = []
	for (const post of rawData) {
		await addFileUrls(post)
		posts.push(post)
	}

	return posts
}
const usePostsGet = (query) => {
	const [postsGet, setPosts] = useState(null)
	const [loadingGet, setLoading] = useState(false)
	const [errorGet, setError] = useState(null)
	const [load, setLoad] = useState(true)

	const reloadGet = () => {
		setLoad(true)
	}
	const postsGetHandler = async () => {
		if (loadingGet) return
		setLoading(true)
		setLoad(false)
		try {
			if (!query) throw new Error('לא התקבלה שאילתה!')
			const fetchedPosts = await postsFetchByQuery(query)
			setPosts(fetchedPosts)
		} catch (error) {
			console.error('Error fetching posts: ', error) // Log error for debugging
			setError(error.message)
		}
		setLoading(false)
	}

	useEffect(() => {
		if(load) {
			setLoad(false)
			postsGetHandler()
		}
	}, [load])
	return { postsGet, loadingGet, errorGet, reloadGet }
}

const queryGetPublishedPosts = (lim = 3) => {
	if (lim < 1)
		return query(
			collection(db, collectionNames.posts),
			where('articleType', '==', 'post'),
			where('published', '==', true),
			orderBy('datePublished', 'desc')
		)
	return query(
		collection(db, collectionNames.posts),
		where('articleType', '==', 'post'),
		where('published', '==', true),
		orderBy('datePublished', 'desc'),
		limit(lim)
	)
}
const queryGetPublishedConventions = (lim = 3) => {
	if (lim < 1)
		return query(
			collection(db, collectionNames.posts),
			where('articleType', '==', 'convention'),
			where('published', '==', true),
			orderBy('datePublished', 'desc')
		)
	return query(
		collection(db, collectionNames.posts),
		where('articleType', '==', 'convention'),
		where('published', '==', true),
		orderBy('datePublished', 'desc'),
		limit(lim)
	)
}

const queryGetAllPostsAdmin = (lim = 3) => {
	if (lim < 1) return query(collection(db, collectionNames.posts), orderBy('dateAdded', 'desc'))
	return query(collection(db, collectionNames.posts), orderBy('dateAdded', 'desc'), limit(lim))
}

export default usePostsGet

export {
	queryGetPublishedPosts,
	queryGetPublishedConventions,
	queryGetAllPostsAdmin,
	postsFetchByQuery,
}
