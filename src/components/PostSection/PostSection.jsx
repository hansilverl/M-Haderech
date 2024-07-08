import React from 'react'
import { useNavigate } from 'react-router-dom'
import './PostSection.css'
import Post from '../Posts/Post'

import usePostsGetMultiple from '../../hooks/usePostsGetMultiple'

const PostsSection = () => {
	const { postsGetMultiple, loadingGetMultiple, errorGetMultiple } = usePostsGetMultiple(3)
	const navigate = useNavigate()

	const handleViewAllClick = () => {
		navigate('/posts')
	}
	return (
		<section id='posts' className='posts-section'>
			<div className='posts-header'>
				<h2>פוסטים</h2>
			</div>
			<div className='posts-container'>
				{loadingGetMultiple ? (
					<h2>טוען...</h2>
				) : errorGetMultiple ? (
					<p>{errorGetMultiple.toString()}</p>
				) : (
					postsGetMultiple.map((post, index) => (
						<Post
							key={index}
							id={post.id}
							imageUrl={post.imageUrl}
							title={post.title}
							date={post.date}
							description={post.description}
							type={post.type}
							contentUrl={post.contentUrl}
							published={post.published}
						/>
					))
				)}
			</div>
			<div className='view-all-button-container'>
				<button onClick={handleViewAllClick} className='view-all-button'>
					ראה את כל הפוסטים
				</button>
			</div>
		</section>
	)
}

export default PostsSection
