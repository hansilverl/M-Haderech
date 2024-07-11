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
	const { resourceUrl, last } = props
	return (
		<>
			<button onClick={() => handleOpenPdf(resourceUrl)} className='pdf-button'>
				<img src={pdfIcon} alt='Open PDF' />
			</button>
			{last && <PdfViewer pdfFile={resourceUrl} />}
		</>
	)
}

const CompressedElementPresentor = (props) => {
	const { resourceUrl } = props
	return <embed src={resourceUrl} />
}

const ElementPicker = ({ element }) => {
	const { type, content, resourceUrl , last} = element
	console.log(element)
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
			return <PdfElementPresentor resourceUrl={resourceUrl} last={last} />
		case 'compressed':
			return <CompressedElementPresentor resourceUrl={resourceUrl} />
		default:
			return null
	}
}

const ElementPresentor = ({ element }) => {
	return (
		<div>
			<ElementPicker element={element} />
		</div>
	)
}
export default ElementPresentor
