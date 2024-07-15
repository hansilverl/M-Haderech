import './PostAdmin.css'

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverTimestamp } from 'firebase/firestore'

import Post from '../Posts/Post'
import usePostDelete from '../../hooks/usePostDelete'
import usePostUpdate from '../../hooks/usePostUpdate'

const PostAdmin = ({ article, setRefresh }) => {
	const { postDelete, startDelete } = usePostDelete(article.id)
	const { postUpdate, startUpdate } = usePostUpdate(article.id)

	const deletePostButton = async () => {
		if (window.confirm('Are you sure you want to delete this post?')) {
			startDelete()
		}
	}

	const togglePublished = async () => {
		article.published = !article.published
		if (!article.datePublished && article.published) article.datePublished = serverTimestamp()
		const newPost = { published: article.published, datePublished: article.datePublished }
		startUpdate(newPost)
	}

	useEffect(() => {
		if (postDelete) setRefresh(true)
	}, [postDelete, article.published])

	const navigate = useNavigate(`/edit/${article.id}`)

	const AdminBar = () => {
		return (
			<div id={article.id} className='admin-bar'>
				<button onClick={() => navigate(`/edit/${article.id}`)} className='admin-button'>
					ערוך
				</button>
				<button onClick={deletePostButton} className='admin-button'>
					מחק
				</button>
				{!article.published ? (
					<button onClick={togglePublished} className='admin-button publish-button'>
						פרסם
					</button>
				) : (
					<button onClick={togglePublished} className='admin-button unpublish-button'>
						בטל פרסום
					</button>
				)}
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
			<Post article={article} />
			<AdminBar id={article.id} />
		</div>
	)
}

export default PostAdmin
