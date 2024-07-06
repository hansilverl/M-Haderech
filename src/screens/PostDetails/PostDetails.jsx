import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './PostDetails.css'
import PdfViewer from '../../components/PdfViewer/PdfViewer'
import { pdfjs } from 'react-pdf'
import pdfIcon from '../../assets/pdf-file.png'
import usePostGet from '../../hooks/usePostGet'
import { getDownloadURLFromPath } from '../../hooks/useResourceManagement'

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
	const { postGet, loadingGet, errorGet, postGetHandler } = usePostGet()

	if (id && !postGet && !loadingGet && !errorGet) postGetHandler(id)

	const handleOpenPdf = () => {
		window.open(postGet.contentUrl, '_blank')
	}

	console.log('postGet', postGet);
	return (
		<div className='post-details'>
			{loadingGet ? (
				<p>טוען...</p>
			) : errorGet ? (
				<p>{errorGet}</p>
			) : !postGet ? (
				<p>הפוסט לא נמצא</p>
			) : (
				<>
					<h1>{postGet.title}</h1>
					<p>
						<strong>תאריך פרסום:</strong> {formatDate(postGet.dateAdded)}
					</p>
					{!postGet?.imageUrl ? null : (
						<div className='image-container'>
							<img
								src={postGet?.imageUrl}
								alt={'לא נמצאה תמונה'}
								style={{ width: '100%', height: 'auto' }}
							/>
						</div>
					)}
					<p>
						<strong>תיאור:</strong> {postGet.description}
					</p>
					{postGet.type === 'file' ? (
						<>
							<button onClick={handleOpenPdf} className='pdf-button'>
								<img src={pdfIcon} alt='Open PDF' />
							</button>
							<PdfViewer pdfFile={postGet.contentUrl} />
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
