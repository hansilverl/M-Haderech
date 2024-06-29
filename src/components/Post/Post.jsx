import React from 'react'
import useImageUrl from '../../hooks/useImageUrl'
import './Post.css'

const Post = ({ id, image, title, date, description }) => {
	const imageUrl = useImageUrl(image)
	return (
		<div id={id ? id : ''} className='post'>
			<img src={imageUrl} alt={title} className='post-image' />
			<h3 className='post-title'>{title}</h3>
			<p className='post-date'>{date}</p>
			<p className='post-description'>{description}</p>
			<button className='post-button'>ראה הכל</button>
		</div>
	)
}

export default Post
