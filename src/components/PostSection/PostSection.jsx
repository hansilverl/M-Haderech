import React from 'react'
import { useNavigate } from 'react-router-dom'
import './PostSection.css'

import PostsPresentor from '../PostsPresentor/PostsPresentor';

const PostsSection = () => {
	const navigate = useNavigate()

	const handleViewAllClick = () => {
		navigate('/articles')
	}

	return (
		<section id='posts' className='posts-section'>
			<div className='posts-header'>
				<h2>מאמרים</h2>
			</div>
			<PostsPresentor type={'post'} published={true} maxRows={1}/>
			<div className='view-all-button-container'>
				<button onClick={handleViewAllClick} className='view-all-button'>
					ראה את כל המאמרים
				</button>
			</div>
		</section>
	)
}

export default PostsSection
