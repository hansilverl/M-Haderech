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
				<button onClick={() => navigate(`/edit/${article.id}`)} className='admin-button'>
					ערוך
				</button>
				<button onClick={deletePostButton} className='admin-button'>
					מחק
				</button>
				{!article.published ? (
					<button onClick={() => togglePublished(true)} className='admin-button publish-button'>
						פרסם
					</button>
				) : (
					<button onClick={() => togglePublished(false)} className='admin-button unpublish-button'>
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
