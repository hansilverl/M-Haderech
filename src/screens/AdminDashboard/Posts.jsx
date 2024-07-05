import React from 'react'
import './Posts.css'
import PostAdmin from '../../components/PostAdmin/PostAdmin'
import usePostsGetAdmin from '../../hooks/usePostsGetAdmin'


const Posts = () => {
	const { posts, loading, error } = usePostsGetAdmin(20)

	return (
		<>
      <button>הוספת פוסט</button>
			{loading ? (
				<h2>טוען...</h2>
			) : error ? (
				<p>{error.toString()}</p>
			) : (
				<div className='posts-container'>
					{posts.map((post, index) => (
						<PostAdmin
							key={index}
							id={post.id}
							image={post.image}
							title={post.title}
							date={post.date}
							description={post.description}
							type={post.type}
							contentFile={post.contentFile}
						/>
					))}
				</div>
			)}
		</>

		// <PostAdmin />
	)
}

export default Posts
