import './GeneralModal.css'

import React, { useEffect } from 'react'
import Modal from 'react-modal'

const GeneralModal = (props) => {
	const { children, isOpen, isEnterPossible, onRequestClose, handleCancel, handleConfirm } = props

	const title = props?.title || 'הודעה כללית'
	const confirmName = props?.confirmName || 'אישור'
	const cancelName = props?.cancelName || 'ביטול'

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Enter') {
				event.preventDefault()
				if (!isEnterPossible) return
				console.log('isEnterPossible', isEnterPossible);
				handleConfirm()
			}
		}

		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown)
		} else {
			window.removeEventListener('keydown', handleKeyDown)
		}
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, isEnterPossible])

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			overlayClassName='general-modal-dialog-overlay'
			className='general-modal-dialog'>
			<h1>{title}</h1>
			{children}
			<div className='general-modal-actions'>
				<button onClick={handleConfirm}>{confirmName}</button>
				<button onClick={handleCancel}>{cancelName}</button>
			</div>
		</Modal>
	)
}

export default GeneralModal
