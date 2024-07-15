import React, { useEffect } from 'react'
import Post from '../../components/Posts/Post'
import usePostsGet, { buildQuery, queryGetPublishedConventions } from '../../hooks/usePostsGet'
import PostsPresentor from '../../components/PostsPresentor/PostsPresentor'
//import './Posts.css';

const Conventions = () => {
	return (
		<div className='posts-screen'>
			<PostsPresentor type={'convention'} published={true} pageSize={20} allowPages={true} />
		</div>
	)
}

export default Conventions
