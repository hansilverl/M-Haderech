import React from 'react'

const ElementPresentor = (props) => {
	const { type, content, resourcePath, present } = props

	switch (type) {
		case 'text':
			return <p>{content}</p>
		case 'image':
			return <img src={resourcePath} alt={content} />
		case 'video':
			return <video controls src={resourcePath} />
		case 'audio':
			return <audio controls src={resourcePath} />
		case 'pdf':
			return <embed src={resourcePath} />
		default:
			return null
	}
}
export default ElementPresentor
