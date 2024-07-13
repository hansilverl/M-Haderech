import './PostElementPresentor.css'

import React, { useState } from 'react'
import { pdfjs } from 'react-pdf'

import PdfViewer from '../PdfViewer/PdfViewer'
import pdfIcon from '../../assets/pdf-file.png'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString()

const handleOpenPdf = (resourcePath) => {
	window.open(resourcePath, '_blank')
}

const TextElementPresentor = (props) => {
	const { content } = props
	return content ? (
		<div className='text-presentor tiptap' dangerouslySetInnerHTML={{ __html: content }} />
	) : (
		<h3>לא נמצא טקסט</h3>
	)
}

const ImageElementPresentor = (props) => {
	const { resourceUrl } = props
	return <img src={resourceUrl} alt={'לא נמצאה תמונה'} />
}

const VideoElementPresentor = (props) => {
	const { resourceUrl } = props
	return resourceUrl ? <video controls src={resourceUrl} /> : <h3>לא נמצא סרטון</h3>
}

const AudioElementPresentor = (props) => {
	const { resourceUrl } = props
	return resourceUrl ? <audio controls src={resourceUrl} /> : <h3>לא נמצא קובץ שמע</h3>
}

const PdfElementPresentor = (props) => {
	const { resourceUrl } = props

	const [presentPdf, setPresentPdf] = useState(false)
	return (
		<div>
			<div className='pdf-container'>
				<button onClick={() => handleOpenPdf(resourceUrl)} className='pdf-button'>
					פתח קובץ
					<img src={pdfIcon} alt='Open PDF' />
				</button>
				<button onClick={() => setPresentPdf(!presentPdf)}>הצג קובץ</button>
			</div>
			{presentPdf && <PdfViewer pdfFile={resourceUrl} />}
		</div>
	)
}

const CompressedElementPresentor = (props) => {
	const { resourceUrl } = props
	return <embed src={resourceUrl} />
}

const ElementPicker = ({ element }) => {
	const { type, content, resourceUrl } = element
	switch (type) {
		case 'text':
			return <TextElementPresentor content={content} />
		case 'image':
			return <ImageElementPresentor resourceUrl={resourceUrl} />
		case 'video':
			return <VideoElementPresentor resourceUrl={resourceUrl} />
		case 'audio':
			return <AudioElementPresentor resourceUrl={resourceUrl} />
		case 'pdf':
			return <PdfElementPresentor resourceUrl={resourceUrl} />
		case 'compressed':
			return <CompressedElementPresentor resourceUrl={resourceUrl} />
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
