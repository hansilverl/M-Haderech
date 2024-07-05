import React, { useState } from 'react'

import TextEditor from '../../components/TextEditor/TextEditor'
import PostTypeSelector from '../../components/PostTypeSelector/PostTypeSelector'

import './PostEditpage.css'
import { useParams } from 'react-router-dom'
import usePostGet from '../../hooks/usePostGet'

const PostEditPageComp = ({ post }) => {
	const postID = useParams()?.id
	const [postType, setPostType] = useState(undefined)
	const { postGet, loadingGet, errorGet, postGetHandler } = usePostGet()

	if (postID && !postGet && !loadingGet && !errorGet) postGetHandler(postID)
	if (postGet?.type !== postType) setPostType(postGet?.type)

	const selectPostType = (postType) => {
		const value = e.target.value
		if (!value) return
		setPostType(value)
	}

	return (
		<div id='edit-post-page' className='flex-col'>
			{!postID ? (
				<h1>לא התקבל מזהה לפוסט</h1>
			) : loadingGet ? (
				<h1>טוען...</h1>
			) : errorGet ? (
				<h1>{errorGet}</h1>
			) : !postGet ? (
				<h1>הפוסט לא נמצא</h1>
			) : (
				<>
					<div className='flex-row'>
						<h3>כותרת הפוסט:</h3>
						<input type='text' placeholder='כותרת' value={postGet.title} />
					</div>
					<div className='flex-row'>
						<h3>תיאור הפוסט:</h3>
						<input type='text' placeholder='תיאור' value={postGet.description} />
					</div>
					<div className='flex-row'>
						<h3>תמונה ראשית:</h3>
						<input type='file' placeholder='תמונה' value={postGet.image} />
					</div>
					<div className='flex-row'>
						<PostTypeSelector selectFunction={selectPostType} />
					</div>
					<div id='post-contents' className='flex-col'>
						<h2>תוכן הפוסט:</h2>
						{postType === 'editor' && <TextEditor initialContent={postGet.contentHTML} />}
						{postType === 'file' && <input type='file' />}
					</div>
				</>
			)}
		</div>
	)
}

const PostEditpage = () => {
	const { id } = useParams()
	const { post, loading, error } = usePostDetails(id)

	return loading ? (
		<h2>טוען...</h2>
	) : error ? (
		<p>{error.toString()}</p>
	) : post ? (
		<PostEditPageComp post={post} />
	) : (
		<h2>הפוסט לא נמצא</h2>
	)
}

export default PostEditpage
