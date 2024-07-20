// src/components/PostAdmin/PostAdmin.jsx
import './PostAdmin.css'

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverTimestamp } from 'firebase/firestore'

import Post from '../Posts/Post'
import usePostDelete from '../../hooks/usePostDelete'
import usePostUpdate from '../../hooks/usePostUpdate'

import GeneralModal from '../GeneralModal/GeneralModal'

const PostAdmin = ({ article, setRefresh }) => {
	const { postDelete, startDelete } = usePostDelete(article.id)
	const { postUpdate, startUpdate } = usePostUpdate(article.id)

	const [showModal, setShowModal] = React.useState(false)

	const deletePost = () => {
		startDelete()
	}

	const togglePublished = async (publish) => {
		if (publish === article.published) return
		article.published = !article.published
		const datePublished =
			article.published && !article.datePublished ? serverTimestamp() : article.datePublished
		const newPost = { published: article.published, datePublished }
		startUpdate(newPost)
	}

	useEffect(() => {
		if (postDelete) setRefresh(true)
	}, [postDelete, article.published])

	useEffect(() => {
		if (postUpdate) {
			article.datePublished = postUpdate.datePublished
		}
	}, [postUpdate, article.published])

	const navigate = useNavigate(`/edit/${article.id}`)

	const AdminBar = () => {
		return (
			<div id={article.id} className='admin-bar'>
				<button onClick={() => navigate(`/admin/edit/${article.id}`)} className='admin-button'>
					עריכה
				</button>
				{!article.published ? (
					<button onClick={() => togglePublished(true)} className='admin-button publish-button'>
						פירסום					</button>
				) : (
					<button onClick={() => togglePublished(false)} className='admin-button unpublish-button'>
						ביטול פרסום
					</button>
				)}
				<button onClick={() => setShowModal(true)} className='admin-button delete-button'>
					מחיקה
				</button>
			</div>
		)
	}

	return (
		<div className='admin-post-container'>
			<div
				className={`post-type-bubble ${
					article.articleType === 'post' ? 'posttype' : 'convention'
				}`}>
				{article.articleType === 'post' ? 'מאמר' : 'כנס'}
			</div>
			<Post article={article} disablePostClick={true} />
			<AdminBar id={article.id} />
			{!showModal ? null : (
				<GeneralModal
					title='האם ברצונך למחוק את המאמר?'
					confirmName='מחיקה'
					cancelName='ביטול'
					isOpen={true}
					isEnterPossible={false}
					onRequestClose={() => setShowModal(false)}
					handleConfirm={() => {
						deletePost()
						setShowModal(false)
					}}
					handleCancel={() => setShowModal(false)}>
					<p>לאחר פעולה זו, לא יהיה ניתן לשחזר את תוכן מאמר זה</p>
					<p>האם Fברצונך להמשיך?</p>
				</GeneralModal>
			)}
		</div>
	)
}

export default PostAdmin
