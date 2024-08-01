// src/screens/Contact/Contact.js
import React, { useState, useEffect, useRef } from 'react'
import { db } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import emailjs from '@emailjs/browser'
import './Contact.css'
// closing icon
import { FaTimes } from 'react-icons/fa'
// import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'

const Contact = () => {
	const [user_name, setName] = useState('')
	const [user_email, setEmail] = useState('')
	const [message, setMessage] = useState('')
	const [contactInfo, setContactInfo] = useState({})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [modal, setModal] = useState({ visible: false, message: '' })

	const form = useRef()

	useEffect(() => {
		const fetchContactInfo = async () => {
			try {
				const docRef = doc(db, 'miscellaneousUpdated', 'contact')
				const contactDoc = await getDoc(docRef)
				if (contactDoc.exists()) {
					setContactInfo(contactDoc.data())
				} else {
					setError('לא נמצאה אינפורמציית קשר.')
				}
			} catch (err) {
				setError('נכשל בטעינת אינפורמציית קשר.')
			} finally {
				setLoading(false)
			}
		}

		fetchContactInfo()
	}, [])

	const sendEmail = (e) => {
		e.preventDefault()

		emailjs.sendForm('service_6ookygf', 'template_srcbp0v', form.current, 'twD4H2uyQGkEbZmZ-').then(
			() => {
				setModal({ visible: true, message: 'לחיים! קיבלנו, נחזור אליך בקרוב.' })
				setName('')
				setEmail('')
				setMessage('')
			},
			(error) => {
				setModal({ visible: true, message: 'שליחת ההודעה נכשלה, נסה שוב מאוחר יותר.' })
				console.error('FAILED...', error.text)
			}
		)

		setTimeout(() => setModal({ visible: false, message: '' }), 5000)
	}

	return (
		<div className='contact-container'>
			<div className='contact-header'>
				<h1>דברי איתנו</h1>
				<h4>אנחנו כאן כדי לשמוע אותך</h4>
			</div>
			<div className='contact-info-container'>
				<form ref={form} className='contact-form' onSubmit={sendEmail}>
					<label>
						<span>שם:</span>
						<input
							type='text'
							onChange={(e) => setName(e.target.value)}
							value={user_name}
							name='user_name'
						/>
					</label>
					<label>
						<span>אימייל:</span>
						<input
							className='email-label-contact'
							style={{ direction: 'ltr' }}
							required
							type='email'
							onChange={(e) => setEmail(e.target.value)}
							value={user_email}
							name='user_email'
						/>
					</label>
					<label>
						<span>כל מה שתרצו לשאול:</span>
						<textarea
							required
							onChange={(e) => setMessage(e.target.value)}
							value={message}
							name='message'
						/>
					</label>
					<button type='submit'>שליחה</button>
				</form>
				{loading}
				{error && <p>שגיאה: {error}</p>}
				{!loading && !error && (
					<div className='contact-info'>
						<h3>זמינות גם:</h3>
						{Object.entries(contactInfo).map(([key, value]) => (
							<p key={key}>
								<strong>{key}:</strong> {value}
							</p>
						))}
					</div>
				)}
				{modal.visible && (
					<div className='modal-contact'>
						<p>{modal.message}</p>
						<FaTimes
							className='close-icon'
							onClick={() => setModal({ visible: false, message: '' })}
						/>
					</div>
				)}
			</div>
		</div>
	)
}
export default Contact
