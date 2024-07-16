import './ToolBarButton.css'

import React, { useState } from 'react'

import ToolbarTooltip from './ToolbarTooltip'

const ToolBarButton = (props) => {
	const { isActiveArg, content, editorFunc, editorFuncArg, editor, className, tooltipText } = props
	const activeClass = editor.isActive(isActiveArg) ? 'is-active' : ''

	const clickHandler = () => {
		if (isActiveArg !== 'orderedList' && isActiveArg !== 'bulletList') {
			editor.chain().focus()[editorFunc](editorFuncArg).run()
			return
		}
		const currentAttributes = editor.getAttributes('paragraph')
		const { dir, textAlign } = currentAttributes

		editor.chain().focus()[editorFunc](editorFuncArg).run()

		if (dir) editor.chain().focus().setTextDirection(dir).run()
		if (textAlign) editor.chain().focus().setTextAlign(textAlign).run()
	}

	const isDisabled = () => {
		return !editor.can().chain().focus()[editorFunc](editorFuncArg).run()
	}

	return (
		<>
			<ToolbarTooltip text={tooltipText}>
				<button
					onClick={clickHandler}
					disabled={isDisabled()}
					className={`text-editor-menu-bar-button ${className} ${activeClass}`}>
					{content}
				</button>
			</ToolbarTooltip>
		</>
	)
}

export default ToolBarButton
