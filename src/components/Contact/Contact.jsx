import React, { useState, useEffect } from 'react'
import { db } from '../../firebase/config'
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore'
import Modal from 'react-modal'
import { FaTrashAlt } from 'react-icons/fa'
import './Contact.css'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

Modal.setAppElement('#root')

const Contact = () => {
	const [contactInfo, setContactInfo] = useState({})
	const [tempContactInfo, setTempContactInfo] = useState({})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [deleteConfirmIsOpen, setDeleteConfirmIsOpen] = useState(false)
	const [fieldToDelete, setFieldToDelete] = useState(null)
	const [newField, setNewField] = useState('')
	const [newFieldValue, setNewFieldValue] = useState('')

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

	const openModal = () => {
		setTempContactInfo({ ...contactInfo })
		setModalIsOpen(true)
	}

	const closeModal = () => {
		setModalIsOpen(false)
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setTempContactInfo((prevInfo) => ({ ...prevInfo, [name]: value }))
	}

	const handleSave = async () => {
		try {
			const docRef = doc(db, 'miscellaneousUpdated', 'contact')
			await updateDoc(docRef, tempContactInfo)
			setContactInfo(tempContactInfo)
			closeModal()
			alert('אינפורמציית קשר עודכנה בהצלחה.')
		} catch (error) {
			alert('שגיאה בעדכון אינפורמציית קשר.')
		}
	}

	const handleAddField = () => {
		if (newField && newFieldValue) {
			setTempContactInfo((prevInfo) => ({ ...prevInfo, [newField]: newFieldValue }))
			setNewField('')
			setNewFieldValue('')
		}
	}

	const handleDeleteField = (fieldKey) => {
		setFieldToDelete(fieldKey)
		setDeleteConfirmIsOpen(true)
	}

	const confirmDeleteField = async () => {
		try {
			const updatedTempContactInfo = { ...tempContactInfo }
			delete updatedTempContactInfo[fieldToDelete]
			setTempContactInfo(updatedTempContactInfo)

			const docRef = doc(db, 'miscellaneousUpdated', 'contact')
			await updateDoc(docRef, {
				[fieldToDelete]: deleteField(),
			})

			setDeleteConfirmIsOpen(false)
			setFieldToDelete(null)
			setContactInfo(updatedTempContactInfo)
			alert('השדה נמחק בהצלחה.')
		} catch (error) {
			alert('שגיאה במחיקת השדה.')
		}
	}

	return (
		<div className='contact-item'>
			{loading && <LoadingSpinner />}
			{error && <p>שגיאה: {error}</p>}
			{!loading && !error && (
				<>
					<button className='update-button' onClick={openModal}>
						עדכון
					</button>

					<Modal
						isOpen={modalIsOpen}
						onRequestClose={closeModal}
						overlayClassName='modal-contact-overlay'
						className='modal-contact-content'>
						<h2>עדכון פרטי קשר</h2>
						<form>
							<table className='contact-table' dir='rtl'>
								<tbody>
									{tempContactInfo &&
										Object.entries(tempContactInfo).map(([key, value]) => (
											<tr key={key}>
												<td>{key}</td>
												<td>
													<input type='text' name={key} value={value} onChange={handleChange} />
												</td>
												<td>
													<FaTrashAlt
														className='delete-icon'
														onClick={() => handleDeleteField(key)}
													/>
												</td>
											</tr>
										))}
								</tbody>
							</table>
							<div className='new-field-contact'>
								<h3>הוסף שדה חדש</h3>
								<input
									type='text'
									placeholder='שם השדה'
									value={newField}
									onChange={(e) => setNewField(e.target.value)}
									className='wide-input-contact'
								/>
								<input
									type='text'
									placeholder='תוכן השדה'
									value={newFieldValue}
									onChange={(e) => setNewFieldValue(e.target.value)}
									className='wide-input-contact'
								/>
								<div className='add-field-button'>
									<button type='button' onClick={handleAddField}>
										הוסף שדה
									</button>
								</div>
							</div>
						</form>
						<div className='modal-actions'>
							<button className='save-changes' onClick={handleSave}>
								שמירה
							</button>

							<button className='cancel-changes' onClick={closeModal}>
								בטל
							</button>
						</div>
					</Modal>

					<Modal
						isOpen={deleteConfirmIsOpen}
						onRequestClose={() => setDeleteConfirmIsOpen(false)}
						overlayClassName='modal-overlay'
						className='modal-content'>
						<h2>אישור מחיקה</h2>
						<p>האם אתה בטוח שברצונך למחוק את השדה הזה?</p>
						<div className='modal-actions'>
							<button onClick={confirmDeleteField}>מחק</button>
							<button onClick={() => setDeleteConfirmIsOpen(false)}>בטל</button>
						</div>
					</Modal>
				</>
			)}
		</div>
	)
}

export default Contact
