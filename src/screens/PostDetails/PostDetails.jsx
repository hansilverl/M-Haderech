import React from 'react'
import { useParams } from 'react-router-dom'
import { pdfjs } from 'react-pdf'
import PdfViewer from '../../components/PdfViewer/PdfViewer'
import pdfIcon from '../../assets/pdf-file.png'
import usePostsGet from '../../hooks/usePostsGet'
import './PostDetails.css'
import PostElementPresentor from '../../components/PostElementPresentor/PostElementPresentor'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString()

const formatDate = (timestamp) => {
	if (!timestamp) return ''
	const date = new Date(timestamp.seconds * 1000) // Convert Firestore timestamp to JavaScript Date object
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0') // getMonth() is zero-based
	const year = date.getFullYear()
	return `${day}/${month}/${year}`
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
					<p>
						<strong>תיאור:</strong> {postsGet.description}
					</p>
					<div>
						{postsGet?.elements.map((element, index) => (
							<PostElementPresentor key={`element-${index}`} element={element} />
						))}
					</div>
				</>
			)}
		</div>
	)
}

export default PostDetails
