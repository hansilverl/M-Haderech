// src/components/NewsletterLink/NewsletterLink.jsx
import React, { useState, useEffect } from 'react'
import { db } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons'
import './NewsletterLink.css'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const NewsletterLink = () => {
	const [newsletterLink, setNewsletterLink] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchNewsletterLink = async () => {
			try {
				const docRef = doc(db, 'miscellaneousUpdated', 'newsletter')
				const docSnap = await getDoc(docRef)
				if (docSnap.exists()) {
					setNewsletterLink(docSnap.data().newsletter)
				} else {
					setError('לא נמצא קישור לניוזלטר.')
				}
			} catch (err) {
				setError('נכשל בטעינת קישור לניוזלטר.')
			} finally {
				setLoading(false)
			}
		}

		fetchNewsletterLink()
	}, [])

	return (
		<a href={newsletterLink} target='_blank' rel='noopener noreferrer' className='corner-popup'>
			{loading && <LoadingSpinner />}
			{error && <p>שגיאה: {error}</p>}
			{!loading && !error && (
				<>
					<div className='icon-container'>
						<FontAwesomeIcon icon={faEnvelope} className='closed-envelope' />
						<FontAwesomeIcon icon={faEnvelopeOpen} className='open-envelope' />
						<div className='tooltip-nl'>הצטרפי לרשימת תפוצה!</div>
					</div>
				</>
			)}
		</a>
	)
}

export default NewsletterLink
