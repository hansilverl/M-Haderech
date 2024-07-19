import '../TextEditor/TextEditor.css'
import './PostElementPresentor.css'

import React, { useState } from 'react'
import { pdfjs } from 'react-pdf'

import PdfViewer from '../PdfViewer/PdfViewer'
import pdfIcon from '../../assets/pdf-file.png'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString()

const TextElementPresentor = (props) => {
	const { content } = props
	return !content ? null : (
		<div
			className='tiptap-presentor-container tiptap'
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	)
}

const ResourceElementPresentor = (props) => {
	const { type, resourceUrl, dimensions } = props

	console.log(dimensions);
	return !resourceUrl ? null : (
		<div
			className='presentor-media-container'
			style={{ width: dimensions?.width, height: dimensions?.height }}>
			{type === 'image' ? (
				<img className='presentor-media' src={resourceUrl} alt={'לא נמצאה תמונה'} />
			) : type === 'video' ? (
				<video className='presentor-media' controls src={resourceUrl} />
			) : type === 'audio' ? (
				<audio className='presentor-media' controls src={resourceUrl} />
			) : (
				<h3>לא נמצא תוכן רכיב</h3>
			)}
		</div>
	)
}

const PdfElementPresentor = (props) => {
	const { resourceUrl } = props

	const [presentPdf, setPresentPdf] = useState(true)
	const [buttonText, setButtonText] = useState('הסתרת קובץ pdf')

	const handleOpenPdf = (resourcePath) => {
		window.open(resourcePath, '_blank')
	}

	const handleShowPdf = () => {
		setPresentPdf(!presentPdf)
		setButtonText(presentPdf ? 'הצגת הקובץ pdf' : 'הסתרת הקובץ pdf')
	}

	return !resourceUrl ? null : (
		<div className='pdf-container'>
			<div className='pdf-buttons-container'>
				<button onClick={() => handleOpenPdf(resourceUrl)} className='pdf-button'>
					פתיחת קובץ
					<img src={pdfIcon} alt='Open PDF' />
				</button>
				<button onClick={handleShowPdf}>{buttonText}</button>
			</div>
			{presentPdf && <PdfViewer pdfFile={resourceUrl} />}
		</div>
	)
}

const OtherElementPresentor = (props) => {
	const { resourceUrl } = props
	return <embed src={resourceUrl} />
}

const ElementPicker = ({ element }) => {
	const { type, content, resourceUrl, dimensions } = element
	switch (type) {
		case 'text':
			return <TextElementPresentor content={content} />
		case 'image':
		case 'video':
		case 'audio':
			return (
				<ResourceElementPresentor type={type} resourceUrl={resourceUrl} dimensions={dimensions} />
			)
		case 'document':
			return <PdfElementPresentor resourceUrl={resourceUrl} />
		case 'other':
			return <OtherElementPresentor resourceUrl={resourceUrl} />
		default:
			return null
	}
}

const PostElementPresentor = ({ element }) => {
	return (
		<div className='post-element-presentor'>
			<ElementPicker element={element} />
		</div>
	)
}
export default PostElementPresentor
