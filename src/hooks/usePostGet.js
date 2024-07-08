import { useState } from 'react'
import { db, storage } from '../firebase/config'
import { collection, doc, getDoc } from 'firebase/firestore'
import { ref, getDownloadURL } from 'firebase/storage'

const addFileUrls = async (post) => {
	if (post?.imagePath) {
		const imageUrl = await getDownloadURL(ref(storage, post.imagePath))
		post['imageUrl'] = imageUrl
	}
	if (post?.contentFile) {
		const contentUrl = await getDownloadURL(ref(storage, post.contentFile))
		post['contentUrl'] = contentUrl
	}
}

const postGetFromDB = async (documentID) => {
	if (!documentID) throw new Error('No document ID provided!')
	const collectionRef = collection(db, 'Posts')
	const docRef = doc(collectionRef, documentID)
	const docSnapshot = await getDoc(docRef)
	if (!docSnapshot.exists()) throw new Error('Post not found')
	const res = { id: docSnapshot.id, ...docSnapshot.data() }
	await addFileUrls(res)
	return res
}

const usePostGet = () => {
	const [postGet, setPostGet] = useState(null)
	const [loadingGet, setLoadingGet] = useState(false)
	const [errorGet, setErrorGet] = useState(null)

	const postGetHandler = async (documentID) => {
		try {
			if (!documentID) throw new Error('No document ID provided!')
			setLoadingGet(true)
			setPostGet(null)
			setErrorGet(null)
			const p = await postGetFromDB(documentID)
			setPostGet(p)
		} catch (error) {
			console.error('Error fetching posts: ', error) // Log error for debugging
			setErrorGet(error)
			setPostGet(null)
		}
		setLoadingGet(false)
	}

	return { postGet, loadingGet, errorGet, postGetHandler }
}

export default usePostGet

export { postGetFromDB, addFileUrls }
