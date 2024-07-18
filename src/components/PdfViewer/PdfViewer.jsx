import './PdfViewer.css'

import { useState } from 'react'
import { Document, Page } from 'react-pdf'

function PdfViewer({ pdfFile }) {
	const [numPages, setNumPages] = useState()

	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages)
	}

	return (
		<div className='pdf-div'>
			<Document className='pdf-document' file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
				{Array.apply(null, Array(numPages))
					.map((x, i) => i + 1)
					.map((page) => {
						return (
							<div className='pdf-page' key={`page-div-${page}`}>
								<p>
									עמוד {page} מ {numPages}
								</p>
								<Page
									key={`page-${page}`}
									pageNumber={page}
									renderTextLayer={false}
									renderAnnotationLayer={false}
								/>
							</div>
						)
					})}
			</Document>
		</div>
	)
}

export default PdfViewer
