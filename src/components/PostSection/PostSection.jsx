import React from 'react'
import { useNavigate } from 'react-router-dom'
import './PostSection.css'
import Post from '../Posts/Post'

import usePostsDetails from '../../hooks/usePostsDetails'

const handleViewAllClick = () => {
  useNavigate('/posts')
}
const PostsSection = () => {
	const { posts, loading, error } = usePostsDetails(3)

	return (
		<section id='posts' className='posts-section'>
			<div className='posts-header'>
				<h2>פוסטים</h2>
			</div>
			<div className='posts-container'>
				{loading ? (
					<h2>טוען...</h2>
				) : error ? (
					<p>{error.toString()}</p>
				) : (
					posts.map((post, index) => (
						<Post
							key={index}
							id={post.id}
							image={post.image}
							title={post.title}
							date={post.date}
							description={post.description}
							type={post.type}
							contentFile={post.contentFile}
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
