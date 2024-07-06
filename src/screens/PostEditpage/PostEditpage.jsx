import React, { useState, useEffect } from 'react'

import TextEditor from '../../components/TextEditor/TextEditor'
import PostTypeSelector from '../../components/PostTypeSelector/PostTypeSelector'

import './PostEditpage.css'
import { useParams } from 'react-router-dom'
import usePostGet from '../../hooks/usePostGet'
import usePostUpdate from '../../hooks/usePostUpdate'
import usePostDelete from '../../hooks/usePostDelete'
import { useNavigate } from 'react-router-dom'
import { serverTimestamp } from 'firebase/firestore'

const PostEditPageComp = ({ postID, post, setRefresh }) => {
	const { postUpdate, loadingUpdate, errorUpdate, postUpdateHandler } = usePostUpdate()
	const { postDelete, loadingDelete, errorDelete, postDeleteHandler } = usePostDelete()

	const [type, setPostType] = useState(post.type ? post.type : 'editor')
	const [title, setTitle] = useState(post.title ? post.title : '')
	const [description, setDescription] = useState(post.description ? post.description : '')
	const [contentHTML, setContentHTML] = useState(post.content ? post.content : '')
	const [isPublished, setIsPublished] = useState(post.published ? post.published : false)
	const navigate = useNavigate()

	useEffect(() => {
		if (postDelete) navigate('/admin/posts')
	}, [postDelete, navigate])

	const selectPostType = (e) => {
		const value = e.target.value
		if (!value) return
		setPostType(value)
	}

	const getNewPost = () => {
		const publishedTimestamp = post?.datePublished ? post.datePublished : serverTimestamp()
		const newPost = {
			title,
			description,
			contentHTML,
			type: type,
			published: isPublished,
		}

		if (isPublished) newPost['datePublished'] = publishedTimestamp
		return newPost
	}
	const handleSave = async () => {
		const postAdditions = getNewPost()
		console.log(postAdditions)
		await postUpdateHandler(postID, postAdditions)
		if (setRefresh) setRefresh(true)
	}

	const togglePublished = async () => {
		setIsPublished(!isPublished)
		await handleSave()
	}

	const handleDelete = async () => {
		await postDeleteHandler(postID)
	}

	return (
		<div id='edit-post-page' className='flex-col'>
			{!post ? (
				<h1>הפוסט לא נמצא</h1>
			) : (
				<>
					<div className='flex-row'>
						<h3>כותרת הפוסט:</h3>
						<input
							type='text'
							placeholder='כותרת'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>
					<div className='flex-row'>
						<h3>תיאור הפוסט:</h3>
						<input
							type='text'
							placeholder='תיאור'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<div className='flex-row'>
						<h3>תמונה ראשית:</h3>
						<input type='file' placeholder='תמונה' readOnly={true} />
					</div>
					<div className='flex-row'>
						<PostTypeSelector selectFunction={selectPostType} />
					</div>
					<div id='post-contents' className='flex-col'>
						<h2>תוכן הפוסט:</h2>
						{type === 'editor' && (
							<TextEditor initialContent={contentHTML} setCurrContent={setContentHTML} />
						)}
						{type === 'file' && <input type='file' />}
					</div>
					<div className='flex-row'>
						<button onClick={handleSave} disabled={loadingUpdate}>
							שמור
						</button>
						<button onClick={handleDelete} disabled={loadingDelete}>
							מחק
						</button>
						{!isPublished ? (
							<button onClick={togglePublished}>פרסם</button>
						) : (
							<button onClick={togglePublished}>בטל פרסום</button>
						)}
					</div>
				</>
			)}
		</div>
	)
}

const PostEditpage = () => {
	const { id: postID } = useParams()
	const { postGet, loadingGet, errorGet, postGetHandler } = usePostGet()
	const [refresh, setRefresh] = useState(true)

	if (refresh && postID && !postGet && !loadingGet && !errorGet) {
		setRefresh(false)
		postGetHandler(postID)
	}

	return loadingGet ? (
		<h2>טוען...</h2>
	) : errorGet ? (
		<>
			<h2>הפוסט לא נמצא</h2>
			<p>{errorGet.toString()}</p>
		</>
	) : postGet ? (
		<PostEditPageComp postID={postID} post={postGet} setRefresh={setRefresh} />
	) : (
		<h2>הפוסט לא נמצא</h2>
	)
}

export default PostEditpage
