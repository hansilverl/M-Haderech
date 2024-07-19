// src/screens/PostEditpage/PostEditpage.jsx
import './PostEditpage.css'

import React, { useState, useEffect, useRef } from 'react'

import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { serverTimestamp } from 'firebase/firestore'
import { FaArrowRight } from 'react-icons/fa'

import usePostsGet from '../../hooks/usePostsGet'
import usePostUpdate from '../../hooks/usePostUpdate'
import usePostDelete from '../../hooks/usePostDelete'

import ElementsEditor from '../../components/PostElementsEditor/ElementsEditor'
import TextAreaWithLimit from '../../components/TextAreaWithLimist/TextAreaWithLimit'
import GeneralModal from '../../components/GeneralModal/GeneralModal'

const PostEditPageComp = ({ postID, post }) => {
	const { postUpdate, loadingUpdate, startUpdate } = usePostUpdate(postID)
	const { postDelete, loadingDelete, startDelete } = usePostDelete(postID)

	const setSaveTimeout = useRef(null)
	const firstRender = useRef(true)
	const [articleType, setPostType] = useState(post.articleType ? post.articleType : 'article')
	const [title, setTitle] = useState(post.title ? post.title : '')
	const [description, setDescription] = useState(post.description ? post.description : '')
	const [published, setPublished] = useState(post.published ? post.published : false)
	const [datePublished, setDatePublished] = useState(post.datePublished ? post.datePublished : null)
	const [elements, setElements] = useState(post.elements ? post.elements : [])
	const [saveButtonPressed, setSaveButtonPressed] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const [saveButtonText, setSaveButtonText] = useState('שמירה')
	const navigate = useNavigate()

	const getNewPost = () => {
		const newPost = {
			title,
			description,
			published,
			datePublished,
			elements,
		}

		for (const key in newPost) {
			if (!newPost[key] && newPost[key] !== false) delete newPost[key]
		}

		return newPost
	}

	const handleSave = () => {
		if (setSaveTimeout.current) clearTimeout(setSaveTimeout.current)
		setSaveTimeout.current = null
		const postAdditions = getNewPost()
		startUpdate(postAdditions)
		if (saveButtonPressed) setSaveButtonText('שומר..')
	}

	const togglePublished = async () => {
		if (!published && !datePublished) {
			setDatePublished(serverTimestamp())
		}
		setPublished(!published)
	}

	const handleDelete = async () => {
		startDelete()
	}

	const forceSave = () => {
		if (setSaveTimeout.current) clearTimeout(setSaveTimeout.current)
		setSaveTimeout.current = null
		setSaveButtonPressed(true)
		handleSave()
	}

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false
			return
		}

		if (setSaveTimeout.current) clearTimeout(setSaveTimeout.current)
		setSaveTimeout.current = setTimeout(() => {
			handleSave()
		}, 500)
	}, [elements, published, title, description])

	useEffect(() => {
		if (postDelete) navigate('/admin/posts')
	}, [postDelete, navigate])

	useEffect(() => {
		if (loadingUpdate) return
		if (postUpdate && saveButtonPressed) {
			setSaveButtonText('נשמר בהצלחה')
			setTimeout(() => {
				setSaveButtonText('שמירה')
			}, 3000)
			setSaveButtonPressed(false)
		}
	}, [postUpdate, loadingUpdate])

	return (
		<div key={postID} className='edit-post-page'>
			<div className='back-button-container'>
				<button className='back-button' onClick={() => navigate(-1)}>
					<FaArrowRight />
				</button>
			</div>
			{!post ? (
				<h1>המאמר לא נמצא</h1>
			) : (
				<>
					<div className='edit-post-header'>
						<div className='editor-header-input'>
							<label className='input-label'>כותרת המאמר:</label>
							<TextAreaWithLimit
								className='text-area'
								limit={60}
								value={title}
								rows={2}
								setValue={setTitle}
							/>
						</div>
						{articleType === 'about-us' ? null : (
							<div className='editor-header-input'>
								<label className='input-label'>תיאור המאמר:</label>
								<TextAreaWithLimit
									className='text-area'
									limit={100}
									value={description}
									rows={3}
									setValue={setDescription}
								/>
							</div>
						)}
					</div>
					<ElementsEditor
						key={postID}
						postID={postID}
						elements={elements}
						setElements={setElements}
					/>
					<div className='buttons-container'>
						<button className='save-post-button'
						 onClick={forceSave} disabled={loadingUpdate}>
							{saveButtonText}
						</button>
						<button
							onClick={() => navigate(`/posts/${post.id}`)}
							disabled={loadingDelete}
							className='publish-button'>
							תצוגה מקדימה
						</button>
						<button
							onClick={togglePublished}
							className={!published ? 'publish-button' : 'unpublish-button'}>
							{published ? 'בטל פרסום' : 'פרסם'}
						</button>
						<button
							onClick={() => setIsModalOpen(true)}
							disabled={loadingDelete}
							className='delete-button'>
							מחק
						</button>
					</div>
				</>
			)}
			{!isModalOpen ? null : (
				<GeneralModal
					title='האם ברצונך למחוק את המאמר?'
					confirmName='מחק'
					cancelName='ביטול'
					isOpen={isModalOpen}
					isEnterPossible={false}
					onRequestClose={() => setIsModalOpen(false)}
					handleConfirm={() => {
						handleDelete()
						setIsModalOpen(false)
					}}
					handleCancel={() => setIsModalOpen(false)}>
					<p>לאחר פעולה זו, לא יהיה ניתן לשחזר את תוכן מאמר זה</p>
					<p>האם אתה בטוח שברצונך להמשיך?</p>
				</GeneralModal>
			)}
		</div>
	)
}

const PostEditPage = ({ postID }) => {
	console.log(postID);
	const { postsGet, loadingGet, errorGet, reloadGet } = usePostsGet(postID)
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		if (refresh) {
			reloadGet()
			setRefresh(false)
		}
	}, [refresh, reloadGet])

	return loadingGet ? (
		<h2>טוען...</h2>
	) : errorGet ? (
		<>
			<h2>המאמר לא נמצא</h2>
			<p>{errorGet.toString()}</p>
		</>
	) : postsGet ? (
		<PostEditPageComp key={postID} postID={postID} post={postsGet} setRefresh={setRefresh} />
	) : (
		<h2>המאמר לא נמצא</h2>
	)
}

const PostEditPageContainer = () => {
	const { id } = useParams()
	return <PostEditPage key={id} postID={id} />
}

export default PostEditPageContainer
