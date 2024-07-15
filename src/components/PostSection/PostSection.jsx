import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './PostSection.css'
import Post from '../Posts/Post'

import usePostsGet, { buildQuery } from '../../hooks/usePostsGet'
import PostsPresentor from '../PostsPresentor/PostsPresentor';

const PostsSection = () => {
	const navigate = useNavigate()

	const handleViewAllClick = () => {
		navigate('/posts')
	}

	return (
		<section id='posts' className='posts-section'>
			<div className='posts-header'>
				<h2>מאמרים</h2>
			</div>
			<PostsPresentor type={'post'} published={true} pageSize={3} />
			<div className='view-all-button-container'>
				<button onClick={handleViewAllClick} className='view-all-button'>
					ראה את כל המאמרים
				</button>
			</div>
		</section>
	)
}

export default PostsSection
