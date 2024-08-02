import React, { useState, useEffect } from 'react'
import { db } from '../../firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Modal from 'react-modal'
import './DonationLink.css'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

Modal.setAppElement('#root')

const DonationLink = () => {
	const [donationLinkHebrew, setDonationLinkHebrew] = useState('')
	const [donationLinkEnglish, setDonationLinkEnglish] = useState('')
	const [tempDonationLinkHebrew, setTempDonationLinkHebrew] = useState('')
	const [tempDonationLinkEnglish, setTempDonationLinkEnglish] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [modalIsOpen, setModalIsOpen] = useState(false)

	useEffect(() => {
		const fetchDonationLink = async () => {
			try {
				const docRef = doc(db, 'miscellaneousUpdated', 'donate_link')
				const docSnap = await getDoc(docRef)
				if (docSnap.exists()) {
					setDonationLinkHebrew(docSnap.data().link_hebrew)
					setDonationLinkEnglish(docSnap.data().link_english)
				} else {
					setError('לא נמצא קישור תרומה.')
				}
			} catch (err) {
				setError('נכשל בטעינת קישור תרומה.')
			} finally {
				setLoading(false)
			}
		}

		fetchDonationLink()
	}, [])

	const openModal = () => {
		setTempDonationLinkHebrew(donationLinkHebrew)
		setTempDonationLinkEnglish(donationLinkEnglish)
		setModalIsOpen(true)
	}

	const closeModal = () => {
		setModalIsOpen(false)
	}

	const handleChangeHebrew = (e) => {
		setTempDonationLinkHebrew(e.target.value)
	}

	const handleChangeEnglish = (e) => {
		setTempDonationLinkEnglish(e.target.value)
	}

	const handleSave = async () => {
		try {
			const docRef = doc(db, 'miscellaneousUpdated', 'donate_link')
			await updateDoc(docRef, {
				link_hebrew: tempDonationLinkHebrew,
				link_english: tempDonationLinkEnglish,
			})
			setDonationLinkHebrew(tempDonationLinkHebrew)
			setDonationLinkEnglish(tempDonationLinkEnglish)
			closeModal()
			alert('קישור תרומה עודכן בהצלחה.')
		} catch (error) {
			alert('שגיאה בעדכון קישור תרומה.')
		}
	}

	return (
		<div className='donation-link'>
			{loading && <LoadingSpinner />}
			{error && <p>שגיאה: {error}</p>}
			{!loading && !error && (
				<>
					<div className='donation-link-content'>
						{/* <p>
							<strong>קישור תרומה בעברית:</strong> {donationLinkHebrew}
						</p>
						<br></br>
						<p>
							<strong>קישור תרומה באנגלית:</strong> {donationLinkEnglish}
						</p> */}
						<button className='update-button' onClick={openModal}>
							עדכון
						</button>
					</div>

					<Modal
						isOpen={modalIsOpen}
						onRequestClose={closeModal}
						overlayClassName='modal-overlay'
						className='modal-content'>
						<h2>עדכון קישורי תרומה</h2>
						<form>
							<div className='modal-field'>
								<label>
									קישור בעברית:
									<input type='text' value={tempDonationLinkHebrew} onChange={handleChangeHebrew} />
								</label>
							</div>
							<div className='modal-field'>
								<label>
									קישור באנגלית:
									<input
										type='text'
										value={tempDonationLinkEnglish}
										onChange={handleChangeEnglish}
									/>
								</label>
							</div>
						</form>
						<div className='modal-actions'>
							<button onClick={handleSave}>שמירה</button>
							<button onClick={closeModal}>ביטול</button>
						</div>
					</Modal>
				</>
			)}
		</div>
	)
}

export default DonationLink
