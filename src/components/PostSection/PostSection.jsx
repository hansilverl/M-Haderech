import React from 'react'
import { useNavigate } from 'react-router-dom'
import './PostSection.css'

import PostsPresentor from '../PostsPresentor/PostsPresentor'

const PostsSection = () => {
	const navigate = useNavigate()

	const handleViewAllClick = () => {
		navigate('/articles')
	}

	return (
		<section id='posts' className='posts-section'>
			<div className='posts-header'>
				<h2>בלוג</h2>
			</div>
			<PostsPresentor className='posts-presentor' type={'post'} published={true} maxRows={1} />
			<div className='view-all-button-container'>
				<button onClick={handleViewAllClick} className='view-all-button'>
					הצגת הכל
				</button>
			</div>
		</section>
	)
}

export default PostsSection
