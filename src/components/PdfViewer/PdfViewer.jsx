import './PdfViewer.css'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

// deployment
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@latest/build/pdf.worker.min.mjs`

// local
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
// 	'pdfjs-dist/build/pdf.worker.min.mjs',
// 	import.meta.url
// ).toString()

function PdfViewer({ pdfFile }) {
	const [numPages, setNumPages] = useState()

	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages)
	}

	return (
		<div className='pdf-div'>
			<Document
				className='pdf-document'
				file={pdfFile}
				onLoadSuccess={onDocumentLoadSuccess}
				loading={<LoadingSpinner />}>
				{Array.apply(null, Array(numPages))
					.map((x, i) => i + 1)
					.map((page) => {
						return (
							<div className='pdf-page' key={`page-div-${page}`}>
								<p>{numPages <= 1 ? null : `עמוד ${page} מ ${numPages}`}</p>
								<Page
									key={`page-${page}`}
									pageNumber={page}
									renderTextLayer={false}
									renderAnnotationLayer={false}
									scale={2}
								/>
							</div>
						)
					})}
			</Document>
		</div>
	)
}

export default PdfViewer
