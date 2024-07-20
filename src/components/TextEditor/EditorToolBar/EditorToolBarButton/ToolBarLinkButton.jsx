import './ToolBarButton.css'

import React, { useState } from 'react'

import ToolbarTooltip from './ToolbarTooltip'
import GeneralModal from '../../../GeneralModal/GeneralModal'

const ToolBarLinkButton = (props) => {
	const { isActiveArg, editorFunc, content, editor, className, tooltipText } = props

	let isActive = editor.isActive(isActiveArg)
	if (editorFunc !== 'setLink') isActive = !isActive

	const activeClass = isActive ? 'is-active' : ''

	const [linkUrl, setLinkUrl] = useState('')
	const [requestLinkModalOpen, setRequestLinkModalOpen] = useState(false)

	const handleConfirm = (linkUrl) => {
		if (!linkUrl || linkUrl === '') {
			return
		}
		let newLink = linkUrl
		if (!newLink.includes('http://') && !newLink.includes('https://')) {
			newLink = `https://${newLink}`
		}
		editor.chain().focus().extendMarkRange('link').setLink({ href: newLink }).run()
		modalClose()
	}

	const modalClose = () => {
		setRequestLinkModalOpen(false)
	}

	const clickHandler = () => {
		if (editorFunc === 'setLink') {
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
				isWarning={true}
				isOpen={requestLinkModalOpen}
				title='הוספת קישור'
				onRequestClose={modalClose}
				handleCancel={modalClose}
				isEnterPossible={false}
				handleConfirm={() => handleConfirm(linkUrl)}>
				<label htmlFor='new-link-url'>הכנס קישור</label>
				<input
					id='new-link-url'
					type='text'
					value={linkUrl}
					onChange={(event) => {
						setLinkUrl(event.target.value)
					}}
					placeholder='כתובת אתר'
				/>
			</GeneralModal>
		</ToolbarTooltip>
	)
}

export default ToolBarLinkButton
