import './TextEditor.css'

import React from 'react'

import { useEditor, EditorContent } from '@tiptap/react'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TextDirection from 'tiptap-text-direction'
import Link from '@tiptap/extension-link'
import CustomFontSize from './CutsomTiptapExtensions/CustomFontSize'

import TextEditorToolBar from './EditorToolBar/TextEditorToolBar'

const TextEditor = ({ content, setContent, isDisabled }) => {
	const extensions = [
		TextDirection.configure({
			types: ['heading', 'paragraph', 'orderedList', 'bulletList', 'listItem'],
			defaultDirection: 'rtl',
		}),
		TextAlign.configure({
			types: ['heading', 'paragraph', 'listItem', 'orderedList', 'bulletList'],
			alignments: ['left', 'center', 'right', 'justify'],
			defaultAlignment: 'right',
		}),
		Underline,
		Color.configure({ types: [TextStyle.name, ListItem.name] }),
		// TextStyle.configure({ types: [ListItem.name] }),
		StarterKit.configure({
			bulletList: {
				keepMarks: true,
				keepAttributes: true,
			},
			orderedList: {
				keepMarks: true,
				keepAttributes: true,
			},
		}),
		Link.configure({
			openOnClick: true, // Links will open on click
			linkOnPaste: true, // Automatically detect and convert URLs pasted into the editor to links
			HTMLAttributes: {
				target: '_blank', // Open links in a new tab
				rel: 'noopener noreferrer',
				class: 'tiptap-custom-link'
			},
		}),
		TextStyle.extend(),
		CustomFontSize,
	]

	const onUpdate = ({ editor }) => {
		if (isDisabled) return
		const text = editor.getHTML()
		setContent(text)
	}

	const onPaste = (content) => {
		return
	}
	const editor = useEditor({
		extensions: extensions,
		editable: isDisabled ? false : true,
		content: content,
		onUpdate,
	})

	return (
		<div className='editor-container'>
			{!isDisabled && <TextEditorToolBar editor={editor} />}
			<EditorContent
				className={`tiptap-editor-container ${isDisabled ? 'disabled' : ''}`}
				editor={editor}
			/>
		</div>
	)
}

export default TextEditor
