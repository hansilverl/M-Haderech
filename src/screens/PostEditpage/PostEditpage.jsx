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
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'

const PostEditPageComp = ({ postID, post }) => {
	const { postUpdate, loadingUpdate, startUpdate } = usePostUpdate(postID)
	const { postDelete, loadingDelete, startDelete } = usePostDelete(postID)

	const [articleType, setPostType] = useState(post.articleType ? post.articleType : 'article')
	const [title, setTitle] = useState(post.title ? post.title : '')
	const [description, setDescription] = useState(post.description ? post.description : '')
	const [published, setPublished] = useState(post.published ? post.published : false)
	const [datePublished, setDatePublished] = useState(post.datePublished ? post.datePublished : null)
	const [elements, setElements] = useState(post.elements ? post.elements : [])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [forceSave, setForceSave] = useState(false)

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
			if (newPost[key] === undefined || newPost[key] === null) delete newPost[key]
		}

		return newPost
	}

	const handleSave = () => {
		const postAdditions = getNewPost()
		startUpdate(postAdditions)
		setSaveButtonText('שומר..')
	}

	const togglePublished = async () => {
		if (!published && !datePublished) {
			setDatePublished(serverTimestamp())
		}
		setPublished(!published)
		setForceSave(true)
	}

	const handleDelete = async () => {
		startDelete()
	}

	const saveButton = () => {
		handleSave()
	}

	useEffect(() => {
		if (postDelete) navigate('/admin/posts')
	}, [postDelete, navigate])

	useEffect(() => {
		if (postUpdate) {
			setSaveButtonText('נשמר בהצלחה')
			setTimeout(() => {
				setSaveButtonText('שמירה')
			}, 3000)
		}
	}, [postUpdate])

	useEffect(() => {
		if (forceSave) {
			setForceSave(false)
			handleSave()
		}
	}, [forceSave, published, handleSave])

	return (
		<div key={postID} className='edit-post-page'>
			{!post ? (
				<h1>המאמר לא נמצא</h1>
			) : (
				<>
					<div className='edit-post-header'>
						<div className='editor-header-input'>
							<label className='input-label'>כותרת המאמר:</label>
							<TextAreaWithLimit
								className='text-area'
								limit={100}
								value={title}
								rows={2}
								setValue={setTitle}
							/>
						</div>
						<div className='editor-header-input'>
							<label className='input-label'>תיאור המאמר:</label>
							<TextAreaWithLimit
								className='text-area'
								limit={200}
								value={description}
								rows={3}
								setValue={setDescription}
							/>
						</div>
					</div>
					<ElementsEditor
						key={postID}
						postID={postID}
						elements={elements}
						setElements={setElements}
						setForceSave={setForceSave}
					/>
					<div className='buttons-container'>
						<button className='save-post-button' onClick={saveButton} disabled={loadingUpdate}>
							{saveButtonText}
						</button>
						{articleType === 'special' ? null : (
							<button
								onClick={togglePublished}
								className={!published ? 'publish-button' : 'unpublish-button'}>
								{published ? 'ביטול פרסום' : 'פרסום'}
							</button>
						)}
						<button
							onClick={() => navigate(`/posts/${post.id}`)}
							disabled={loadingDelete}
							className='unpublish-button'>
							תצוגה מקדימה
						</button>
						<button
							onClick={() => setIsModalOpen(true)}
							disabled={loadingDelete}
							className='delete-button'>
							מחיקה
						</button>
					</div>
				</>
			)}
			{!isModalOpen ? null : (
				<GeneralModal
					isWarning={true}
					title='האם ברצונך למחוק את המאמר?'
					confirmName='מחיקה'
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

const PostEditPageContainer = ({ postID }) => {
	const { postsGet, loadingGet, errorGet, reloadGet } = usePostsGet(postID)
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		if (refresh) {
			reloadGet()
			setRefresh(false)
		}
	}, [refresh, reloadGet])

	return (
		<div>
			{loadingGet && <LoadingSpinner />}
			{errorGet && <p>שגיאה: {errorGet}</p>}
			{!postsGet && <h2>המאמר לא נמצא</h2>}
			{postsGet && (
				<PostEditPageComp key={postID} postID={postID} post={postsGet} setRefresh={setRefresh} />
			)}
		</div>
	)
}

const PostEditPage = () => {
	const { id } = useParams()
	return <PostEditPageContainer key={id} postID={id} />
}

export default PostEditPage
