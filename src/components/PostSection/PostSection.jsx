import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './PostSection.css'
import Post from '../Posts/Post'

import usePostsGet, { queryGetPublishedPosts } from '../../hooks/usePostsGet'

const PostsSection = () => {
	const query = queryGetPublishedPosts(3)
	const { postsGet, loadingGet, errorGet } = usePostsGet(query)

	const navigate = useNavigate()

	const handleViewAllClick = () => {
		navigate('/posts')
	}

	return (
		<section id='posts' className='posts-section'>
			<div className='posts-header'>
				<h2>מאמרים</h2>
			</div>
			<div className='posts-container'>
				{loadingGet ? (
					<h2>טוען...</h2>
				) : errorGet ? (
					<p>{errorGet.toString()}</p>
				) : !postsGet ? (
					<h2>המאמרים לא נמצאו</h2>
				) : (
					postsGet.map((post, index) => (
						<Post
							key={index}
							article={post}
						/>
					))
				)}
			</div>
			<div className='view-all-button-container'>
				<button onClick={handleViewAllClick} className='view-all-button'>
					ראה את כל המאמרים
				</button>
			</div>
		</section>
	)
}

export default PostsSection
