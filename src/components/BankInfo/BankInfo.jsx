import './BankInfo.css'

import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { db } from '../../firebase/config'
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore'
import { FaTrashAlt } from 'react-icons/fa'

Modal.setAppElement('#root')

const BankInfo = () => {
	const [bankInfo, setBankInfo] = useState({})
	const [tempBankInfo, setTempBankInfo] = useState({})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [deleteConfirmIsOpen, setDeleteConfirmIsOpen] = useState(false)
	const [fieldToDelete, setFieldToDelete] = useState(null)
	const [newField, setNewField] = useState('')
	const [newFieldValue, setNewFieldValue] = useState('')

	useEffect(() => {
		const fetchBankInfo = async () => {
			try {
				const docRef = doc(db, 'miscellaneousUpdated', 'bank_information')
				const bankDoc = await getDoc(docRef)
				if (bankDoc.exists()) {
					setBankInfo(bankDoc.data())
				} else {
					setError('לא נמצאה אינפורמציית בנק.')
				}
			} catch (err) {
				setError('נכשל בטעינת אינפורמציית בנק.')
			} finally {
				setLoading(false)
			}
		}

		fetchBankInfo()
	}, [])

	const openModal = () => {
		setTempBankInfo({ ...bankInfo })
		setModalIsOpen(true)
	}

	const closeModal = () => {
		setModalIsOpen(false)
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setTempBankInfo((prevInfo) => ({ ...prevInfo, [name]: value }))
	}

	const handleSave = async () => {
		try {
			const docRef = doc(db, 'miscellaneousUpdated', 'bank_information')
			await updateDoc(docRef, tempBankInfo)
			setBankInfo(tempBankInfo)
			closeModal()
			alert('אינפורמציית בנק עודכנה בהצלחה.')
		} catch (error) {
			alert('שגיאה בעדכון אינפורמציית בנק.')
		}
	}

	const handleAddField = () => {
		if (newField && newFieldValue) {
			setTempBankInfo((prevInfo) => ({ ...prevInfo, [newField]: newFieldValue }))
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
			const updatedTempBankInfo = { ...tempBankInfo }
			delete updatedTempBankInfo[fieldToDelete]
			setTempBankInfo(updatedTempBankInfo)

			const docRef = doc(db, 'miscellaneousUpdated', 'bank_information')
			await updateDoc(docRef, {
				[fieldToDelete]: deleteField(),
			})

			setDeleteConfirmIsOpen(false)
			setFieldToDelete(null)
			setBankInfo(updatedTempBankInfo)
			alert('השדה נמחק בהצלחה.')
		} catch (error) {
			alert('שגיאה במחיקת השדה.')
		}
	}

	if (loading) return 
	if (error) return <p>שגיאה: {error}</p>

	return (
		<div className='stat-item'>
			{loading }
			{error && <p>שגיאה: {error}</p>}
			{!loading && !error && (
				<>
					{/* <div className='stat-label'>
						{bankInfo &&
							Object.entries(bankInfo).map(([key, value]) => (
								<div key={key} className='stat-field'>
									<p>
										<strong>{key}:</strong> {value}
									</p>
								</div>
							))}
					</div> */}
					<button className='update-button' onClick={openModal}>
						עדכון
					</button>

					<Modal /* Modal for updating bank info */
						isOpen={modalIsOpen}
						onRequestClose={closeModal}
						overlayClassName='modal-stat-overlay'
						className='modal-stat-content'>
						<h2>עדכון פרטי בנק</h2>
						<form>
							<table className='stat-table' dir='rtl'>
								<tbody>
									{tempBankInfo &&
										Object.entries(tempBankInfo).map(([key, value]) => (
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
							<div className='new-field-stat'>
								<h3>הוספת שדה חדש</h3>
								<input
									type='text'
									placeholder='שם השדה'
									value={newField}
									onChange={(e) => setNewField(e.target.value)}
									className='wide-input-stat'
								/>
								<input
									type='text'
									placeholder='תוכן השדה'
									value={newFieldValue}
									onChange={(e) => setNewFieldValue(e.target.value)}
									className='wide-input-stat'
								/>
								<div className='add-field-button'>
									<button type='button' onClick={handleAddField}>
										הוספת שדה
									</button>
								</div>
							</div>
						</form>
						<div className='modal-actions'>
							<button className='save-changes' onClick={handleSave}>
								שמירה
							</button>
							<button className='cancel-changes' onClick={closeModal}>
								ביטול
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
							<button onClick={confirmDeleteField}>מחיקה</button>
							<button onClick={() => setDeleteConfirmIsOpen(false)}>ביטול</button>
						</div>
					</Modal>
				</>
			)}
		</div>
	)
}

export default BankInfo
