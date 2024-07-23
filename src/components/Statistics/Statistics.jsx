// src/components/Statistics/Statistics.jsx
import React, { useState, useEffect } from 'react'
import { db } from '../../firebase/config'
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore'
import Modal from 'react-modal'
import { FaTrashAlt } from 'react-icons/fa'
import './Statistics.css'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

Modal.setAppElement('#root')

const Statistics = () => {
	const [statistics, setStatistics] = useState({})
	const [tempStatistics, setTempStatistics] = useState({})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [deleteConfirmIsOpen, setDeleteConfirmIsOpen] = useState(false)
	const [fieldToDelete, setFieldToDelete] = useState(null)
	const [newField, setNewField] = useState('')
	const [newFieldValue, setNewFieldValue] = useState('')

	useEffect(() => {
		const fetchStatistics = async () => {
			try {
				const statsDoc = doc(db, 'miscellaneousUpdated', 'statistics')
				const statsSnapshot = await getDoc(statsDoc)
				if (statsSnapshot.exists()) {
					setStatistics(statsSnapshot.data())
				} else {
					setError('לא נמצאו סטטיסטיקות.')
				}
				setLoading(false)
			} catch (err) {
				setError('נכשל באחזור הסטטיסטיקות.')
				setLoading(false)
			}
		}

		fetchStatistics()
	}, [])

	const openModal = () => {
		setTempStatistics({ ...statistics })
		setModalIsOpen(true)
	}

	const closeModal = () => {
		setModalIsOpen(false)
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setTempStatistics((prevStats) => ({ ...prevStats, [name]: value }))
	}

	const handleSave = async () => {
		try {
			const statsDoc = doc(db, 'miscellaneousUpdated', 'statistics')
			await updateDoc(statsDoc, tempStatistics)
			setStatistics(tempStatistics)
			closeModal()
			alert('הסטטיסטיקה עודכנה בהצלחה.')
		} catch (error) {
			alert('שגיאה בעדכון הסטטיסטיקה.')
		}
	}

	const handleAddField = () => {
		if (newField && newFieldValue) {
			setTempStatistics((prevStats) => ({ ...prevStats, [newField]: newFieldValue }))
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
			const updatedTempStatistics = { ...tempStatistics }
			delete updatedTempStatistics[fieldToDelete]
			setTempStatistics(updatedTempStatistics)

			const statsDoc = doc(db, 'miscellaneousUpdated', 'statistics')
			await updateDoc(statsDoc, {
				[fieldToDelete]: deleteField(),
			})

			setDeleteConfirmIsOpen(false)
			setFieldToDelete(null)
			setStatistics(updatedTempStatistics)
			alert('השדה נמחק בהצלחה.')
		} catch (error) {
			alert('שגיאה במחיקת השדה.')
		}
	}

	if (loading) return <LoadingSpinner />
	if (error) return <p>שגיאה: {error}</p>

	return (
		<div className='stat-item'>
			<div className='stat-label'>
				{/* {statistics && Object.entries(statistics).map(([key, value]) => (
          <div key={key} className="stat-field">
            <p><strong>{key}:</strong> {value}</p>
          </div>
        ))} */}
			</div>
			<button className='update-button' onClick={openModal}>
				עדכן
			</button>

			<Modal /* Modal for updating statistics */
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				overlayClassName='modal-stat-overlay'
				className='modal-stat-content'>
				<h2>עדכון סטטיסטיקות</h2>
				<h4>
					אין להוסיף תווים נוספים מלבד מספרים. המערכת תדאג להפריד מספרים באמצעות פסיקים בצורה
					אוטומטית.
				</h4>
				<form>
					<table className='stat-table' dir='rtl'>
						<tbody>
							{tempStatistics &&
								Object.entries(tempStatistics).map(([key, value]) => (
									<tr key={key}>
										<td>{key}</td>
										<td>
											<input type='text' name={key} value={value} onChange={handleChange} />
										</td>
										<td>
											<FaTrashAlt className='delete-icon' onClick={() => handleDeleteField(key)} />
										</td>
									</tr>
								))}
						</tbody>
					</table>
					<div className='new-field-stat'>
						<h3>הוסף שדה חדש</h3>
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
		</div>
	)
}

export default Statistics
