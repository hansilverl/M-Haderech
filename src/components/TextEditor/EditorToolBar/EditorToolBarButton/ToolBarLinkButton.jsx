import './ToolBarButton.css'

import React, { useState } from 'react'

import ToolbarTooltip from './ToolbarTooltip'
import GeneralModal from '../../../GeneralModal/GeneralModal'

const ToolBarLinkButton = (props) => {
	const { isActiveArg, editorFunc, content, editor, className, tooltipText } = props

	let isActive = editor.isActive(isActiveArg)
	if (editorFunc !== 'setLink') isActive = !isActive

	const activeClass = isActive ? 'is-active' : ''

	const [link, setLinkUrl] = useState('')
	const [requestLinkModalOpen, setRequestLinkModalOpen] = useState(false)

	const modalClose = () => {
		setRequestLinkModalOpen(false)
		if (!link || link === '') {
			return
		}
		let newLink = link
		if (!newLink.includes('http://') && !newLink.includes('https://')) {
			newLink = `https://${newLink}`
		}
		editor.chain().focus().extendMarkRange('link').setLink({ href: newLink }).run()
		setLinkUrl('')
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
		<ToolbarTooltip text={tooltipText}>
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
		</ToolbarTooltip>
	)
}

export default ToolBarLinkButton
