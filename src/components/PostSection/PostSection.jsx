import React from 'react'

import usePosts from '../../hooks/usePosts'
import './PostSection.css'
import Post from '../Posts/Post'

const PostsSection = () => {
	const { posts, loading, error } = usePosts()
	const posts1 = [
		{
			image: 'images/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
			title: 'פוסט 1',
			date: '02/06/2024',
			description: 'תיאור של פוסט 1',
		},
		{
			image: 'images/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
			title: 'פוסט 2',
			date: '02/06/2024',
			description: 'תיאור של פוסט 2',
		},
		{
			image: 'images/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
			title: 'פוסט 3',
			date: '02/06/2024',
			description: 'תיאור של פוסט 3',
		},
		{
			image: 'images/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
			title: 'פוסט 4',
			date: '02/06/2024',
			description: 'תיאור של פוסט 4',
		},
	]

	return (
		<section id='posts' className='posts-section'>
			<div className='posts-header'>
				<h2>פוסטים</h2>
				<div className='view-all-button-container'>
					<button className='view-all-button'>ראה את כל הפוסטים</button>
				</div>
			</div>
			<div className='posts-container'>
				{posts1.map((post, index) => (
					<Post
						key={index}
						image={post.image}
						title={post.title}
						date={post.date}
						description={post.description}
					/>
				))}
			</div>
		</section>
	)
}

export default PostsSection
