import React, { useState, useEffect, useRef } from 'react'

import Selector from '../../components/Selector/Selector'

import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { serverTimestamp } from 'firebase/firestore'

import usePostsGet from '../../hooks/usePostsGet'
import usePostUpdate from '../../hooks/usePostUpdate'
import usePostDelete from '../../hooks/usePostDelete'

import './PostEditpage.css'
import ElementsEditor from '../../components/PostElementsEditor/ElementsEditor'
const PostEditPageComp = ({ postID, post }) => {
	const { loadingUpdate, postUpdateHandler } = usePostUpdate(postID)
	const { postDelete, loadingDelete, postDeleteHandler } = usePostDelete(postID)

	const setSaveTimeout = useRef(null)
	const [articleType, setPostType] = useState(post.articleType ? post.articleType : 'article')
	const [title, setTitle] = useState(post.title ? post.title : '')
	const [description, setDescription] = useState(post.description ? post.description : '')
	const [published, setPublished] = useState(post.published ? post.published : false)
	const [datePublished, setDatePublished] = useState(post.datePublished ? post.datePublished : null)
	const [elements, setElements] = useState(post.elements ? post.elements : [])

	const [saveButtonText, setSaveButtonText] = useState('שמור')
	const navigate = useNavigate()

	const getNewPost = () => {
		const newPost = {
			title,
			description,
			articleType,
			published,
			datePublished,
			elements,
		}

		for (const key in newPost) {
			if (!newPost[key] && newPost[key] !== false) delete newPost[key]
		}

		return newPost
	}

	const handleSave = async () => {
		if (setSaveTimeout.current) clearTimeout(setSaveTimeout.current)
		setSaveTimeout.current = null

		const postAdditions = getNewPost()
		await postUpdateHandler(postAdditions)
		setSaveButtonText('נשמר בהצלחה')
		setTimeout(() => setSaveButtonText('שמור'), 3000)
	}

	const togglePublished = async () => {
		if (!published && !datePublished) {
			setDatePublished(serverTimestamp())
		}
		setPublished(!published)
	}

	const handleDelete = async () => {
		const confirmDelete = window.confirm('האם אתה בטוח שברצונך למחוק את הפוסט?')
		if (confirmDelete) {
			await postDeleteHandler(postID)
		}
	}

	const handleBack = () => {
		navigate(-1) // Go back to the previous page
	}

	useEffect(() => {
		if (setSaveTimeout.current) clearTimeout(setSaveTimeout.current)
		setSaveTimeout.current = setTimeout(() => {
			handleSave()
		}, 300)
	}, [elements, published])

	useEffect(() => {
		if (postDelete) navigate('/admin/posts')
	}, [postDelete, navigate])

	return (
		<div  className='edit-post-page main-flex-col'>
			{!post ? (
				<h1>הפוסט לא נמצא</h1>
			) : (
				<>
					<div className='main-flex-row'>
						<label className='input-label'>כותרת הפוסט:</label>
						<input
							type='text'
							placeholder='כותרת'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>
					<div className='main-flex-row'>
						<label className='input-label'>תיאור הפוסט:</label>
						<input
							type='text'
							placeholder='תיאור'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<div className='main-flex-row'>
						<Selector
							id='post-type'
							name='סוג הפוסט (פוסט או כנס)'
							value={articleType}
							selectFunction={setPostType}
							optionValues={['post', 'convention']}
							optionNames={['פוסט', 'כנס']}
						/>
					</div>
					<ElementsEditor elements={elements} setElements={setElements} />
					<div className='main-flex-row'>
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
						<button onClick={handleBack} className='back-button'>
							חזור
						</button>
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
		if (refresh) {
			postsGetHandler()
			setRefresh(false)
		}
	}, [refresh, postsGetHandler])

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
