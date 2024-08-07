import './PostDetails.css'

import React from 'react'
import { useParams } from 'react-router-dom'

import usePostsGet from '../../hooks/usePostsGet'
import PostElementPresentor from '../../components/PostElementPresentor/PostElementPresentor'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'

const formatDate = (timestamp) => {
	if (!timestamp) return ''
	const date = new Date(timestamp.seconds * 1000) // Convert Firestore timestamp to JavaScript Date object
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0') // getMonth() is zero-based
	const year = date.getFullYear()
	return `${day}/${month}/${year}`
}

const PostDetailsContainer = ({ id }) => {
	const { postsGet, loadingGet, errorGet } = usePostsGet(id)

	return (
		<div className='post-details-external-container general-container'>
			<div className='post-details-container'>
				{loadingGet && <LoadingSpinner />}
				{errorGet && <p>שגיאה: {errorGet}</p>}
				{!loadingGet && !postsGet && <h2>המאמר לא נמצא</h2>}
				{postsGet && (
					<>
						<div className='post-details-header'>
							<h1>{postsGet.title}</h1>
							{postsGet.articleType === 'special' ? null : (
								<p>
									<strong>תאריך פרסום:</strong> {formatDate(postsGet.dateAdded)}
								</p>
							)}
							<p>
								<strong></strong> {postsGet.description}
							</p>
						</div>
						<div className='post-details-elements'>
							{postsGet?.elements.map((element, index) => (
								<PostElementPresentor key={`element-${index}`} element={element} />
							))}
						</div>
					</>
				)}
			</div>
		</div>
	)
}

const PostDetails = ({ id: postID }) => {
	const { id: paramId } = useParams()
	const id = postID ? postID : paramId
	return <PostDetailsContainer key={id} id={id} />
}

export default PostDetails
