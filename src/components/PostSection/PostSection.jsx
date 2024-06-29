import React from 'react'

import usePostsDetails from '../../hooks/usePostsDetails'
import './PostSection.css'
import Post from '../Post/Post'
import { useNavigate } from 'react-router-dom'

const PostsSection = () => {
	const { posts, loading, error } = usePostsDetails(3)

	return (
		<section id='posts' className='posts-section'>
			<div className='posts-header'>
				<h2>פוסטים</h2>
				<div className='view-all-button-container'>
					<button  className='view-all-button'>
						ראה את כל הפוסטים
					</button>
				</div>
			</div>
			<div className='posts-container'>
				{loading ? (
					<h2>טוען...</h2>
				) : ( error ? (
					<h2>{error}</h2>
				) : (
					posts.slice(0, 3)
						.map((post, index) => (
							<Post
								key={index}
								image={post.image}
								title={post.title}
								date={post.date}
								description={post.description}
							/>
						))
				)) }
			</div>
		</section>
	)
}

export default PostsSection
