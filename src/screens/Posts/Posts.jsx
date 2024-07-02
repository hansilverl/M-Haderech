import React from 'react'
import Post from '../../components/Posts/Post'
import usePostsDetails from '../../hooks/usePostsDetails'
import './Posts.css'

const Posts = () => {
	const { posts, loading, error } = usePostsDetails(20)

	return (
		<div className='posts-screen'>
			<h2></h2>
			{loading ? (
				<h2>טוען...</h2>
			) : error ? (
				<p>{error.toString()}</p>
			) : (
				<div className='posts-container'>
					{posts.map((post, index) => (
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
					))}
				</div>
			)}
		</div>
	)
}

export default Posts
