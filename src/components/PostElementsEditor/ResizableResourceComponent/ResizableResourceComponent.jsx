import React, { useEffect, useRef, useState } from 'react'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css'
import './ResizableResourceComponent.css'

const ResizableComponent = ({ mediaType, src, dimensions, setDimensions }) => {
	const [currDimensions, setCurrDimensions] = useState(dimensions)
	const saveTimeout = useRef(null)

	const saveDim = () => {
		if (saveTimeout.current) {
			clearTimeout(saveTimeout.current)
			saveTimeout.current = null
		}
		setDimensions(currDimensions)
	}

	const onResize = (e, { size }) => {
		console.log(size)
		if (size) setCurrDimensions({ width: size.width, height: size.height })
	}

	useEffect(() => {
		if (saveTimeout.current) clearTimeout(saveTimeout.current)
		saveTimeout.current = setTimeout(saveDim, 500)
	}, [currDimensions])

	if (!currDimensions) {
		setCurrDimensions({ width: 300, height: 300 })
	}

	return !src ? null : !currDimensions ? null : (
		<ResizableBox
			className='resizable-container'
			width={currDimensions.width}
			height={currDimensions.height}
			onResize={onResize}
			minConstraints={[70, 70]}
			maxConstraints={[900, 700]}>
			<div className='media-container'>
				{mediaType === 'image' && <img src={src} alt='resizable' />}
				{mediaType === 'video' && <video controls src={src}></video>}
				{mediaType === 'audio' && <audio controls src={src}></audio>}
			</div>
		</ResizableBox>
	)
}

export default ResizableComponent
