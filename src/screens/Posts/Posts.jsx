import React from 'react'
import Post from '../../components/Posts/Post'
import usePostsGetMultiple from '../../hooks/usePostsGetMultiple'
import './Posts.css'

const Posts = () => {
	const { postsGetMultiple, loadingGetMultiple, errorGetMultiple } = usePostsGetMultiple(20)

	return (
		<div className='posts-screen'>
			<h2></h2>
			{loadingGetMultiple ? (
				<h2>טוען...</h2>
			) : errorGetMultiple ? (
				<p>{errorGetMultiple.toString()}</p>
			) : (
				<div className='posts-container'>
					{postsGetMultiple.map((post, index) => (
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
