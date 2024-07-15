import './Posts.css'

import React from 'react'
import Post from '../../components/Posts/Post'
import usePostsGet, { buildQuery } from '../../hooks/usePostsGet'

import PostsPresentor from '../../components/PostsPresentor/PostsPresentor'

const Posts = () => {
	return (
		<div className='posts-screen'>
			<PostsPresentor type={'post'} published={true} pageSize={20} allowPages={true} />
		</div>
	)
}

export default Posts
