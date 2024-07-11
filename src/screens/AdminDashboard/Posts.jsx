import React, { useState, useEffect } from 'react'
import './Posts.css'
import PostAdmin from '../../components/PostAdmin/PostAdmin'
import usePostsGet, { queryGetAllPostsAdmin } from '../../hooks/usePostsGet'
import usePostCreate from '../../hooks/usePostCreate'
import { useNavigate } from 'react-router-dom'

const Posts = () => {
	const query = queryGetAllPostsAdmin(20)
	const { postsGet, loadingGet, errorGet, postsGetHandler } = usePostsGet(query)
	const [isCreateButtonDisabled, setCreateButtonDisabled] = useState(false)
	const { postCreateID, postCreateHandler } = usePostCreate()
	const [needToReload, setNeedToReload] = useState(true)
	const navigate = useNavigate()

	const addPostHandler = async (e) => {
		setCreateButtonDisabled(true)
		await postCreateHandler()
	}

	useEffect(() => {
		if (needToReload) postsGetHandler(20)
		setNeedToReload(false)
	}, [needToReload])

	useEffect(() => {
		if (postCreateID) {
			navigate(`/edit/${postCreateID}`)
		}
	}, [postCreateID, navigate])

	return (
		<div className='container'>
			<div className='header'>
				<button
					className='add-post-button'
					onClick={addPostHandler}
					disabled={isCreateButtonDisabled}>
					הוספת פוסט
				</button>
			</div>
			{loadingGet ? (
				<div className='loading'>טוען...</div>
			) : errorGet ? (
				<div className='error'>{errorGet.toString()}</div>
			) : !postsGet ? (
				<h2 className='error'>הפוסטים לא נמצאו</h2>
			) : (
				<div className='posts-container'>
					{postsGet.map((post, index) => (
						<PostAdmin key={index} id={post.id} post={post} setRefresh={setNeedToReload} />
					))}
				</div>
			)}
		</div>
	)
}

export default Posts
