import React from 'react'
import { useParams } from 'react-router-dom'
import './PostDetails.css'
import PdfViewer from '../../components/PdfViewer/PdfViewer'
import { pdfjs } from 'react-pdf'
import pdfIcon from '../../assets/pdf-file.png'
import usePostsGet from '../../hooks/usePostsGet'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString()

const formatDate = (timestamp) => {
	if (!timestamp) return ''
	const date = new Date(timestamp.seconds * 1000) // Convert Firestore timestamp to JavaScript Date object
	return date.toLocaleDateString('en-US') // Adjust the locale as needed
}

const PostDetails = () => {
	const { id } = useParams()
	const { postsGet, loadingGet, errorGet } = usePostsGet(id)

	const handleOpenPdf = () => {
		window.open(postsGet.contentUrl, '_blank')
	}

	return (
		<div className='post-details'>
			{loadingGet ? (
				<p>טוען...</p>
			) : errorGet ? (
				<p>{errorGet.toString()}</p>
			) : !postsGet ? (
				<p>הפוסט לא נמצא</p>
			) : (
				<>
					<h1>{postsGet.title}</h1>
					<p>
						<strong>תאריך פרסום:</strong> {formatDate(postsGet.dateAdded)}
					</p>
					{!postsGet?.imageUrl ? null : (
						<div className='image-container'>
							<img
								src={postsGet.imageUrl}
								alt={'לא נמצאה תמונה'}
								style={{ width: '100%', height: 'auto' }}
							/>
						</div>
					)}
					<p>
						<strong>תיאור:</strong> {postsGet.description}
					</p>
					{postsGet.type === 'file' ? (
						<>
							<button onClick={handleOpenPdf} className='pdf-button'>
								<img src={pdfIcon} alt='Open PDF' />
							</button>
							<PdfViewer pdfFile={postsGet.contentUrl} />
						</>
					) : (
						<div className='tiptap' dangerouslySetInnerHTML={{ __html: postsGet.contentHTML }} />
					)}
				</>
			)}
		</div>
	)
}

export default PostDetails
