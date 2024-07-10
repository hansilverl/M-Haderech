import React from 'react'
import { pdfjs } from 'react-pdf'

import PdfViewer from '../../PdfViewer/PdfViewer'
import pdfIcon from '../../../assets/pdf-file.png'

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
		<div className='tiptap' dangerouslySetInnerHTML={{ __html: content }} />
	) : (
		<h3>לא נמצא טקסט</h3>
	)
}

const ImageElementPresentor = (props) => {
	const { resourcePath } = props
	return <img src={resourcePath} alt={'לא נמצאה תמונה'} />
}

const VideoElementPresentor = (props) => {
	const { resourcePath } = props
	return resourcePath ? <video controls src={resourcePath} /> : <h3>לא נמצא סרטון</h3>
}

const AudioElementPresentor = (props) => {
	const { resourcePath } = props
	return resourcePath ? <audio controls src={resourcePath} /> : <h3>לא נמצא קובץ שמע</h3>
}

const PdfElementPresentor = (props) => {
	const { resourcePath } = props
	return (
		<>
			<button onClick={() => handleOpenPdf(resourcePath)} className='pdf-button'>
				<img src={pdfIcon} alt='Open PDF' />
			</button>
			<PdfViewer pdfFile={resourcePath} />
		</>
	)
}

const CompressedElementPresentor = (props) => {
	const { resourcePath } = props
	return <embed src={resourcePath} />
}

const ElementPresentor = ({ element }) => {
	const { type, content, resourcePath, present } = element

	if (!present) return null
	switch (type) {
		case 'text':
			return <TextElementPresentor content={content} />
		case 'image':
			return <ImageElementPresentor resourcePath={resourcePath} />
		case 'video':
			return <VideoElementPresentor resourcePath={resourcePath} />
		case 'audio':
			return <AudioElementPresentor resourcePath={resourcePath} />
		case 'pdf':
			return <PdfElementPresentor resourcePath={resourcePath} />
		case 'compressed':
			return <CompressedElementPresentor resourcePath={resourcePath} />
		default:
			return null
	}
}
export default ElementPresentor
