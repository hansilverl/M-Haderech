import './TextEditor.css'

import React from 'react'

import { useEditor, EditorContent, EditorProvider, useCurrentEditor } from '@tiptap/react'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextDirection from 'tiptap-text-direction'

import {
	FaBold,
	FaItalic,
	FaStrikethrough,
	FaUnderline,
	FaUndo,
	FaRedo,
	FaListUl,
	FaListOl,
	FaAlignLeft,
	FaAlignCenter,
	FaAlignRight,
	FaAlignJustify,
} from 'react-icons/fa'
import TextAlign from '@tiptap/extension-text-align'

import { MdOutlineFormatTextdirectionRToL, MdFormatTextdirectionLToR } from 'react-icons/md'

const getFontSize = (elementType) => {
	// Create a temporary h1 element
	const tempH1 = document.createElement(elementType, { visibility: 'hidden' })
	tempH1.style.visibility = 'hidden' // Make it invisible
	document.body.appendChild(tempH1)

	// Get the computed font size
	const fontSize = window.getComputedStyle(tempH1).fontSize

	// Remove the temporary h1 element
	document.body.removeChild(tempH1)
	return fontSize
}

const MenuBar = () => {
	const { editor } = useCurrentEditor()

	if (!editor) {
		return null
	}

	const onFontSizeChange = (e) => {
		const fontSize = e.target.value
		for (let i = 1; i <= 6; i++) {
			if (editor.isActive('heading', { level: 1 }))
				editor.chain().focus().toggleHeading({ level: 1 }).run()
		}
		editor.chain().focus().setParagraph().run()

		switch (fontSize) {
			case 'h5':
				editor.chain().focus().toggleHeading({ level: 5 }).run()
				break
			case 'h4':
				editor.chain().focus().toggleHeading({ level: 4 }).run()
				break
			case 'h3':
				editor.chain().focus().toggleHeading({ level: 3 }).run()
				break
			case 'h2':
				editor.chain().focus().toggleHeading({ level: 2 }).run()
				break
			case 'h1':
				editor.chain().focus().toggleHeading({ level: 1 }).run()
				break
		}
	}

	return (
		<div className='menu-bar'>
			<div className='sub-menu-bar'>
				<button
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
					className={`use-button`}>
					<FaRedo />
				</button>
				<button
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().chain().focus().redo().run()}
					className={`use-button`}>
					<FaUndo />
				</button>
			</div>
			<div className='sub-menu-bar'>
				<button
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					className={`${editor.isActive('bold') ? 'is-active' : ''}`}>
					<FaBold />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editor.can().chain().focus().toggleItalic().run()}
					className={`${editor.isActive('italic') ? 'is-active' : ''}`}>
					<FaItalic />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					disabled={!editor.can().chain().focus().toggleUnderline().run()}
					className={` ${editor.isActive('underline') ? 'is-active' : ''}`}>
					<FaUnderline />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleStrike().run()}
					disabled={!editor.can().chain().focus().toggleStrike().run()}
					className={`${editor.isActive('strike') ? 'is-active' : ''}`}>
					<FaStrikethrough />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={`${editor.isActive('bulletList') ? 'is-active' : ''} `}>
					<FaListUl />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={`${editor.isActive('orderedList') ? 'is-active' : ''}`}>
					<FaListOl />
				</button>
				<button
					onClick={() => editor.chain().focus().setTextAlign('right').run()}
					className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
					<FaAlignRight />
				</button>
				<button
					onClick={() => editor.chain().focus().setTextAlign('center').run()}
					className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
					<FaAlignCenter />
				</button>
				<button
					onClick={() => editor.chain().focus().setTextAlign('left').run()}
					className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>
					<FaAlignLeft />
				</button>
				<button
					onClick={() => editor.chain().focus().setTextAlign('justify').run()}
					className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}>
					<FaAlignJustify />
				</button>
				<button
					onClick={() => editor.chain().focus().setTextDirection('rtl').run()}
					className={editor.isActive({ dir: 'rtl' }) ? 'is-active' : ''}>
					<MdOutlineFormatTextdirectionRToL />
				</button>
				<button
					onClick={() => editor.chain().focus().setTextDirection('ltr').run()}
					className={editor.isActive({ dir: 'ltr' }) ? 'is-active' : ''}>
					<MdFormatTextdirectionLToR />
				</button>

				<select onChange={onFontSizeChange} className='editor-button'>
					<option value='h5' style={{ fontSize: `${getFontSize('h5')}` }}>
						קטן מאוד
					</option>
					<option value='p' style={{ fontSize: `${getFontSize('p')}` }}>
						קטן
					</option>
					<option value='h3' style={{ fontSize: `${getFontSize('h3')}` }}>
						בינוני
					</option>
					<option value='h2' style={{ fontSize: `${getFontSize('h2')}` }}>
						גדול
					</option>
					<option value='h1' style={{ fontSize: `${getFontSize('h1')}` }}>
						ענק
					</option>
				</select>
			</div>
		</div>
	)
}

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

const TextEditor = () => {
	let html = content

	return (
		<>
			<MenuBar />
			<EditorProvider
				slotBefore={<MenuBar />}
				extensions={extensions}
				content={content}
				onUpdate={({ editor }) => {
					html = editor.getHTML()
				}}
			/>
			<button onClick={() => console.log(html)}>save</button>
		</>
	)
}

export default TextEditor
