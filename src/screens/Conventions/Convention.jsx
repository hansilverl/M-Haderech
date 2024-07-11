import React, { useEffect } from 'react';
import Post from '../../components/Posts/Post';
import usePostsGet, { queryGetPublishedPosts } from '../../hooks/usePostsGet';
//import './Posts.css';

const Conventions = () => {
	const query = queryGetPublishedPosts(20);
	const { postsGet, loadingGet, errorGet } = usePostsGet(query);

	// Filter posts to only include articles with articleType === 'convention'
	const conventionPosts = postsGet ? postsGet.filter(post => post.articleType === 'convention') : [];

	return (
		<div className='posts-screen'>
			<h2>כנסים</h2>
			{loadingGet ? (
				<h2>טוען...</h2>
			) : errorGet ? (
				<h2>{errorGet.toString()}</h2>
			) : conventionPosts.length === 0 ? (
				<h2>לא נמצאו כנסים</h2>
			) : (
				<div className='posts-container'>
					{conventionPosts.map((post, index) => (
						<Post key={index} article={post} />
					))}
				</div>
			)}
		</div>
	);
};

export default Conventions;
