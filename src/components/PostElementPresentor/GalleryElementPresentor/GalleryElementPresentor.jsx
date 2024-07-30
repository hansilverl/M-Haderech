import './GalleryElementPresentor.css'
import 'react-image-gallery/styles/css/image-gallery.css'

import ImageGallery from 'react-image-gallery'
import React, { useEffect, useRef } from 'react'

export function ElementGalleryPresentor(props) {
	const { files, setCurentIndex } = props

	const galleryRef = useRef(null)

	const handleVideoPlay = () => {
		if (galleryRef.current) {
			galleryRef.current.pause()
		}
	}

	const handleVideoEnd = () => {
		if (galleryRef.current) {
			galleryRef.current.play()
		}
	}

	const images = [
		{
			original: 'https://picsum.photos/id/1018/1000/600/',
			thumbnail: 'https://picsum.photos/id/1018/250/150/',
		},
		{
			original: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
			thumbnail: 'https://picsum.photos/id/1018/250/150/',
			embedUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
			description: 'Video 1',
			renderItem: (item) => (
				<div className='video-wrapper'>
					<video
						controls
						className='video-element'
						onPlay={() => handleVideoPlay()}
						onEnded={() => handleVideoEnd()}>
						<source src={item.embedUrl} type='video/mp4' />
					</video>
				</div>
			),
		},
	]

	const onSlideChange = (index) => {
		console.log('index', index)
		if (setCurentIndex) setCurentIndex(index)
	}

	return (
		<ImageGallery
			ref={galleryRef}
			items={images}
			additionalClass={`items-${1}`}
			showPlayButton={false}
			showFullscreenButton={false}
			onSlide={onSlideChange}
		/>
	)
}

export default ElementGalleryPresentor
