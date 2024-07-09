import React, { useState, useEffect } from 'react'

import TextEditor from '../../components/TextEditor/TextEditor'
import Selector from '../../components/Selector/Selector'

import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { serverTimestamp } from 'firebase/firestore'

import usePostsGet from '../../hooks/usePostsGet'
import usePostUpdate from '../../hooks/usePostUpdate'
import usePostDelete from '../../hooks/usePostDelete'
import PostResourceInput from '../../components/PostResourceInput/PostResourceInput'

import './PostEditpage.css'
const PostEditPageComp = ({ postID, post, setRefresh }) => {
	const { loadingUpdate, postUpdateHandler } = usePostUpdate(postID)
	const { postDelete, loadingDelete, postDeleteHandler } = usePostDelete(postID)

	const [contentType, setContentType] = useState(post.contentType ? post.contentType : 'editor')
	const [postType, setPostType] = useState(post.postType ? post.postType : 'post')
	const [title, setTitle] = useState(post.title ? post.title : '')
	const [description, setDescription] = useState(post.description ? post.description : '')
	const [contentHTML, setContentHTML] = useState(post.content ? post.content : '')
	const [published, setPublished] = useState(post.published ? post.published : false)
	const [imagePath, setImagePath] = useState(post.imagePath ? post.imagePath : '')
	const [imageUrl, setImageUrl] = useState(post.imageUrl ? post.imageUrl : '')
	const [contentFile, setContentFile] = useState(post.contentFile ? post.contentFile : '')
	const [contentUrl, setContentFileUrl] = useState(post.contentUrl ? post.contentUrl : '')
	const [datePublished, setDatePublished] = useState(post.datePublished ? post.datePublished : null)

	const [saveButtonText, setSaveButtonText] = useState('שמור')
	const navigate = useNavigate()

	const getNewPost = () => {
		const newPost = {
			title,
			description,
			contentHTML,
			postType,
			contentType,
			published,
			imagePath,
			contentFile,
			datePublished,
		}

		for (const key in newPost) {
			if (!newPost[key] && newPost[key] !== false) delete newPost[key]
		}

		return newPost
	}

	const handleSave = async () => {
		const postAdditions = getNewPost()
		await postUpdateHandler(postAdditions)
		if (setRefresh) setRefresh(true)
		setSaveButtonText('נשמר בהצלחה')
		setTimeout(() => setSaveButtonText('שמור'), 3000)
	}

	const togglePublished = async () => {
		if (!published && !datePublished) {
			setDatePublished(serverTimestamp())
		}
		setPublished(!published)
		await handleSave()
	}

	const handleDelete = async () => {
		const confirmDelete = window.confirm('האם אתה בטוח שברצונך למחוק את הפוסט?')
		if (confirmDelete) {
			await postDeleteHandler(postID)
		}
	}

	useEffect(() => {
		handleSave()
	}, [imagePath, contentFile, published])

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
						<label className='input-label'>כותרת הפוסט:</label>
						<input
							type='text'
							placeholder='כותרת'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>
					<div className='flex-row'>
						<label className='input-label'>תיאור הפוסט:</label>
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
						<Selector
							id='content-type'
							name='סוג הפוסט'
							value={contentType}
							selectFunction={setContentType}
							optionValues={['editor', 'file']}
							optionNames={['עורך', 'קובץ']}
						/>
					</div>
					<div className='flex-row'>
						<Selector
							id='post-type'
							name='סוג הפוסט (פוסט או כנס)'
							value={postType}
							selectFunction={setPostType}
							optionValues={['post', 'convention']}
							optionNames={['פוסט', 'כנס']}
						/>
					</div>
					<div id='post-contents'>
						<h2 className='title-content'>תוכן הפוסט:</h2>
						{contentType === 'editor' ? (
							<TextEditor initialContent={contentHTML} setCurrContent={setContentHTML} />
						) : contentType === 'file' ? (
							<PostResourceInput
								path={contentFile}
								setPath={setContentFile}
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
							{saveButtonText}
						</button>
						<button onClick={handleDelete} disabled={loadingDelete} className='delete-button'>
							מחק
						</button>
						{!published ? (
							<button onClick={togglePublished} className='publish-button'>
								פרסם
							</button>
						) : (
							<button onClick={togglePublished} className='unpublish-button'>
								בטל פרסום
							</button>
						)}
					</div>
				</>
			)}
		</div>
	)
}

const PostEditPage = () => {
	const { id: postID } = useParams()
	const { postsGet, loadingGet, errorGet, postsGetHandler } = usePostsGet(postID)
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		if (refresh) postsGetHandler()
	}, [refresh])

	return loadingGet ? (
		<h2>טוען...</h2>
	) : errorGet ? (
		<>
			<h2>הפוסט לא נמצא</h2>
			<p>{errorGet.toString()}</p>
		</>
	) : postsGet ? (
		<PostEditPageComp postID={postID} post={postsGet} setRefresh={setRefresh} />
	) : (
		<h2>הפוסט לא נמצא</h2>
	)
}

export default PostEditPage
