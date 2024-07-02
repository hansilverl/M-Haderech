import React from 'react';
import Post from '../../components/Post/Post';
import usePostsDetails from '../../hooks/usePostsDetails';
import './Posts.css';

const Posts = () => {
 const { posts, loading, error } = usePostsDetails()
  return (
		<div className='posts-screen'>
			<h2></h2>
			<div className='posts-container'>
				{loading ? (
					<h2>טוען...</h2>
				) : error ? (
					<p>{error.toString()}</p>
				) : (
					posts.map((post, index) => (
						<Post
							id={post.id}
							key={index}
							image={post.image}
							title={post.title}
							date={post.date}
							description={post.description}
						/>
					))
				)}
			</div>
		</div>
	)
};

export default Posts;
