import React from 'react'
import { useParams } from 'react-router-dom'
import './PostDetails.css'
import PdfViewer from '../../components/PdfViewer/PdfViewer'
import { pdfjs } from 'react-pdf'
import pdfIcon from '../../assets/pdf-file.png'
import usePostDetails from '../../hooks/usePostDetails'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString()

const PostDetails = () => {
	const { id } = useParams()
	const { post, loading, error } = usePostDetails(id)

	console.log('post', post)

	const handleOpenPdf = () => {
		window.open(post.contentFile, '_blank')
	}

	return (
		<div className='post-details'>
			{loading ? (
				<p>טוען...</p>
			) : error ? (
				<p>{error}</p>
			) : (
				<>
					<h1>{post.title}</h1>
					<p>
						<strong>תאריך פרסום:</strong> {post.date}
					</p>
					<div className='image-container'>
						<img src={post.image} alt={post.title} style={{ width: '100%', height: 'auto' }} />
					</div>
					<p>
						<strong>תיאור:</strong> {post.description}
					</p>
					{post.type === 'pdf' ? (
						<>
							<button onClick={handleOpenPdf} className='pdf-button'>
								<img src={pdfIcon} alt='Open PDF' />
							</button>
							<PdfViewer pdfFile={post.contentFile} />
						</>
					) : (
						<div className='tiptap' dangerouslySetInnerHTML={{ __html: post.contentHTML }} />
					)}
				</>
			)}
		</div>
	)
}

export default PostDetails
