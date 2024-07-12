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
import TiptapFontSize from './TipTapFontSize'

import TextEditorToolBar from './MenuBar/TextEditorToolBar'

const TextEditor = ({ content, setContent }) => {
	const extensions = [
		TextDirection.configure({
			types: ['heading', 'paragraph', 'orderedList'],
			defaultDirection: 'rtl',
		}),
		TextAlign.configure({
			types: ['heading', 'paragraph'],
			alignments: ['left', 'center', 'right', 'justify'],
		}),
		Underline,
		Color.configure({ types: [TextStyle.name, ListItem.name] }),
		// TextStyle.configure({ types: [ListItem.name] }),
		StarterKit.configure({
			bulletList: {
				keepMarks: true,
				keepAttributes: false,
			},
			orderedList: {
				keepMarks: true,
				keepAttributes: false,
			},
		}),
		TextStyle.extend(),
		TiptapFontSize,
	]

	const onUpdate = ({ editor }) => {
		setContent(editor.getHTML())
	}

	const editor = useEditor({
		extensions: extensions,
		content: content,
		onUpdate,
	})

	return (
		<div className='editor-container'>
			<TextEditorToolBar editor={editor} />
			<EditorContent editor={editor} />
		</div>
	)
}

export default TextEditor
