import './ToolBarButton.css'

import React, { useState } from 'react'

import GeneralModal from '../../../Modals/GeneralModal'

const ToolBarLinkButton = (props) => {
	const { isActiveArg, editorFunc, content, editor, className } = props

	let isActive = editor.isActive(isActiveArg)
	if (editorFunc !== 'setLink') isActive = !isActive

	const activeClass = isActive ? 'is-active' : ''

	const [link, setLinkUrl] = useState('')
	const [requestLinkModalOpen, setRequestLinkModalOpen] = useState(false)

	const modalClose = () => {
		setRequestLinkModalOpen(false)
		if (link && link !== '') {
			editor.chain().focus().extendMarkRange('link').setLink({ href: link }).run()
			setLinkUrl('')
		}
	}

	const clickHandler = () => {
		if (editorFunc === 'setLink') {
			setLinkUrl('')
			setRequestLinkModalOpen(true)
		} else {
			editor.chain().focus().extendMarkRange('link').unsetLink().run()
		}
	}

	const isDisabled = () => {
		const res =
			editorFunc == 'setLink'
				? !editor
						.can()
						.chain()
						.focus()
						.extendMarkRange('link')
						.setLink({ href: 'https://google.com' })
						.run()
				: !editor.can().chain().focus().extendMarkRange('link').unsetLink().run()

		return res
	}

	return (
		<>
			<button
				onClick={clickHandler}
				disabled={isDisabled()}
				className={`text-editor-menu-bar-button ${className} ${activeClass}`}>
				{content}
			</button>
			<GeneralModal
				isOpen={requestLinkModalOpen}
				onRequestClose={modalClose}
				handleCancel={modalClose}
				isEnterPossible={true}
				handleConfirm={modalClose}>
				<label htmlFor='new-link-url'>הכנס קישור</label>
				<input
					id='new-link-url'
					type='text'
					value={link}
					onChange={(event) => setLinkUrl(event.target.value)}
					placeholder='כתובת אתר'
				/>
			</GeneralModal>
		</>
	)
}

export default ToolBarLinkButton
