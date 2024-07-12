import './GeneralModal.css'

import React from 'react'
import Modal from 'react-modal'

const GeneralModal = (props) => {
	const { children, isOpen, onRequestClose, handleCancel, handleConfirm } = props

	const title = props?.title || 'הודעה כללית'
	const confirmName = props?.confirmName || 'אישור'
	const cancelName = props?.cancelName || 'ביטול'

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
