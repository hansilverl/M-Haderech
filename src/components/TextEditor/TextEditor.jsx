import './TextEditor.css'

import React from 'react'

import { useEditor, EditorContent, EditorProvider, useCurrentEditor } from '@tiptap/react'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TextDirection from 'tiptap-text-direction'

import MenuBar from './MenuBar/MenuBar'

const TextEditor = () => {
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

	const content = `
<h1 style="text-align: center">זה ניסיון</h1>
<p style="text-align: right">אני כותב דברים</p>
<ul>
	<li><p style="text-align: right">עם רשימה</p></li>
	<li><p style="text-align: right">כזו</p></li>
</ul>
<p style="text-align: right">וגם</p>
<ol>
	<li><p style="text-align: right">רשימה</p></li>
	<li><p style="text-align: right">כזו</p></li>
</ol>
<p style="text-align: right">
	ואפשר לעשות כל מיני אפקטים כמו <strong>בולד, </strong><em>על הצד</em>, <u>קו תחתון</u> וגם
	<s>קו כזה</s>.
</p>
<p style="text-align: right">אפשר כמובן לכתוב בעברית, also in English</p>
<h2 dir="ltr">Also we can type in English</h2>
<p></p>
`
	let html = content
	const editor = useEditor({ extensions: extensions, content: content })

	return (
		<div className='flex-col justify-right'>
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
			<button id='save-btn' onClick={() => console.log(html)}>
				save
			</button>
		</div>
	)
}

export default TextEditor
