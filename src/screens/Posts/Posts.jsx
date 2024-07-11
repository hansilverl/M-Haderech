import React, { useEffect } from 'react'
import Post from '../../components/Posts/Post'
import usePostsGet, { queryGetPublishedPosts } from '../../hooks/usePostsGet'
import './Posts.css'

const Posts = () => {
	const query = queryGetPublishedPosts(20)
	const { postsGet, loadingGet, errorGet } = usePostsGet(query)

	return (
		<div className='posts-screen'>
			<h2></h2>
			{loadingGet ? (
				<h2>טוען...</h2>
			) : errorGet ? (
				<h2>{errorGet.toString()}</h2>
			) : !postsGet ? (
				<h2>הפוסטים לא נמצאו</h2>
			) : (
				<div className='posts-container'>
					{postsGet.map((post, index) => (
						<Post
							key={index}
							article={post}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export default Posts
