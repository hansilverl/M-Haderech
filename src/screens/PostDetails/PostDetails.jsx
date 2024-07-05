import React from 'react'
import { useParams } from 'react-router-dom'
import './PostDetails.css'
import PdfViewer from '../../components/PdfViewer/PdfViewer'
import { pdfjs } from 'react-pdf'
import pdfIcon from '../../assets/pdf-file.png'
import usePostGet from '../../hooks/usePostGet'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString()

const PostDetails = () => {
	const { id } = useParams()
	const { postGet, loadingGet, errorGet, postGetHandler } = usePostGet()

	if (id && !postGet && !loadingGet && !errorGet) postGetHandler(id)
	const handleOpenPdf = () => {
		window.open(postGet.contentFile, '_blank')
	}

	return (
		<div className='post-details'>
			{loadingGet ? (
				<p>טוען...</p>
			) : errorGet ? (
				<p>{errorGet}</p>
			) : (
				<>
					<h1>{postGet.title}</h1>
					<p>
						<strong>תאריך פרסום:</strong> {postGet.date}
					</p>
					<div className='image-container'>
						<img
							src={postGet.image}
							alt={postGet.title}
							style={{ width: '100%', height: 'auto' }}
						/>
					</div>
					<p>
						<strong>תיאור:</strong> {postGet.description}
					</p>
					{postGet.type === 'pdf' ? (
						<>
							<button onClick={handleOpenPdf} className='pdf-button'>
								<img src={pdfIcon} alt='Open PDF' />
							</button>
							<PdfViewer pdfFile={postGet.contentFile} />
						</>
					) : (
						<div className='tiptap' dangerouslySetInnerHTML={{ __html: postGet.contentHTML }} />
					)}
				</>
			)}
		</div>
	)
}

export default PostDetails
