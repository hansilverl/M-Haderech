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
import PostResourceInput from '../../components/PostResourceInput/PostResourceInput'

const PostEditPageComp = ({ postID, post, setRefresh }) => {
	const { loadingUpdate, postUpdateHandler } = usePostUpdate(postID)
	const { postDelete, loadingDelete, postDeleteHandler } = usePostDelete(postID)

	const [type, setPostType] = useState(post.type ? post.type : 'editor')
	const [title, setTitle] = useState(post.title ? post.title : '')
	const [description, setDescription] = useState(post.description ? post.description : '')
	const [contentHTML, setContentHTML] = useState(post.content ? post.content : '')
	const [isPublished, setIsPublished] = useState(post.published ? post.published : false)
	const [imagePath, setImagePath] = useState(post.imageUrl ? post.imageUrl : '')
	const [imageUrl, setImageUrl] = useState(post.imageUrl ? post.imageUrl : '')
	const [contentFilePath, setContentFilePath] = useState(post.contentFile ? post.contentFile : '')
	const [contentUrl, setContentFileUrl] = useState(post.contentUrl ? post.contentUrl : '')
	const [datePublished, setDatePublished] = useState(post.datePublished ? post.datePublished : null)

	const navigate = useNavigate()
	const selectPostType = (e) => {
		const value = e.target.value
		if (!value) return
		setPostType(value)
	}

	const getNewPost = () => {
		const newPublishDate = post?.datePublished ? post.datePublished : serverTimestamp()
		const newPost = {
			title,
			description,
			contentHTML,
			type,
			published: isPublished,
			imagePath: imagePath,
			contentFile: contentFilePath,
		}

		if ((isPublished && datePublished === null) || datePublished === undefined) {
			newPost['datePublished'] = newPublishDate
			setDatePublished(newPublishDate)
		}
		return newPost
	}
	const handleSave = async () => {
		const postAdditions = getNewPost()
		await postUpdateHandler(postAdditions)
		if (setRefresh) setRefresh(true)
	}

	const togglePublished = async () => {
		setIsPublished(!isPublished)
		await handleSave()
	}

	const handleDelete = async () => {
		await postDeleteHandler(postID)
	}
	useEffect(() => {
		handleSave()
	}, [imagePath, contentFilePath, isPublished])

	useEffect(() => {
		if (postDelete) navigate('/admin/posts')
	}, [postDelete, navigate])

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
					<PostResourceInput
						path={imagePath}
						setPath={setImagePath}
						url={imageUrl}
						setUrl={setImageUrl}
						type='image'
						title='תמונה'
					/>
					<div className='flex-row'>
						<PostTypeSelector selectFunction={selectPostType} />
					</div>
					<div id='post-contents'>
						<h2>תוכן הפוסט:</h2>
						{type === 'editor' ? (
							<TextEditor initialContent={contentHTML} setCurrContent={setContentHTML} />
						) : type === 'file' ? (
							<PostResourceInput
								path={contentFilePath}
								setPath={setContentFilePath}
								url={contentUrl}
								setUrl={setContentFileUrl}
								type='pdf'
								title='קובץ PDF'
							/>
						) : (
							<div>לא נבחר סוג פוסט</div>
						)}
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
