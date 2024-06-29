import './TextEditor.css'

import React, { useState } from 'react'

import { useEditor, EditorContent } from '@tiptap/react'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TextDirection from 'tiptap-text-direction'

import MenuBar from './MenuBar/MenuBar'

const TextEditor = (props) => {
	const [editorContent, setEditorContent] = useState('editorContent')

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
		TextStyle.configure({ types: [ListItem.name] }),
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
	]

	const content =
		
		`
<h1 style="text-align: center">כותרת משנית</h1>
<p style="text-align: right">תוכן</p>
`

	const editor = useEditor({
		extensions: extensions,
		content: content,
		onUpdate({ editor }) {
			setEditorContent(editor.getHTML())
		},
	})

	return (
		<div id='text-editor' className='flex-col justify-right'>
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
			<button type='submit' id='save-btn' onClick={() => console.log(editorContent)}>
				שמור
			</button>
		</div>
	)
}

export default TextEditor
