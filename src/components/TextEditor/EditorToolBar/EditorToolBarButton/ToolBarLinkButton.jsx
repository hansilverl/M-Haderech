import './ToolBarButton.css'

import React, { useState } from 'react'

import GeneralModal from '../../../Modals/GeneralModal'

const ToolBarLinkButton = (props) => {
	const { isActiveArg, content, editor, className } = props
	const activeClass = editor.isActive(isActiveArg) ? 'is-active' : ''

	const [link, setLinkUrl] = useState('')
	const [requestLink, setRequestLink] = useState(false)

	const modalClose = () => {
		setRequestLink(false)
		if (link && link !== '') {
			editor.chain().focus().extendMarkRange('link').setLink({ href: link }).run()
			setLinkUrl('')
		}
	}

	const clickHandler = () => {
		setLinkUrl('')
		setRequestLink(true)
	}

	const isDisabled = () => {
		if (typeof editorFunc === 'string') {
			return !editor.can().chain().focus()[editorFunc](editorFuncArgs).run()
		}

		let tempEditor = editor.can().chain().focus()
		editorFunc.forEach((func, index) => {
			tempEditor = tempEditor[func](editorFuncArgs[index])
		})
		return !tempEditor
	}

	return (
		<>
			<button
				onClick={clickHandler}
				disabled={isDisabled}
				className={`text-editor-menu-bar-button ${className} ${activeClass}`}>
				{content}
			</button>
			<GeneralModal
				isOpen={requestLink}
				onRequestClose={modalClose}
				handleCancel={modalClose}
				handleConfirm={clickHandler}>
				<form></form>
			</GeneralModal>
		</>
	)
}

export default ToolBarLinkButton
