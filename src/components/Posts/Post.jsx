import React, { useEffect, useState } from 'react'
import { ref, getDownloadURL } from 'firebase/storage'

import { storage } from '../../firebase/config'
import './Post.css'

const Post = ({ id, image, title, date, description }) => {
	const [imageUrl, setImageUrl] = useState('')

	useEffect(() => {
		const fetchImage = async () => {
			const imageRef = ref(storage, image)
			const url = await getDownloadURL(imageRef)
			setImageUrl(url)
		}

		fetchImage()
	}, [])

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
