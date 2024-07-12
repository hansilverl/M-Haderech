import './MenuBar.css'

import React from 'react'

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

import { MdOutlineFormatTextdirectionRToL, MdFormatTextdirectionLToR } from 'react-icons/md'

import MenuBarButton from './MenuBar-Button/MenuBarButton'
import MenuBarSelect from './MenuBar-Select/MenuBarSelect'

const MenuBar = (props) => {
	const { editor } = props

	if (!editor) {
		return null
	}

	return (
		<div className='text-editor-menu-bar' editor={editor}>
			<MenuBarButton
				className='use-button'
				editorFunc={'undo'}
				editor={editor}
				content={<FaRedo />}
			/>
			<MenuBarButton
				className='use-button'
				editorFunc={'redo'}
				editor={editor}
				content={<FaUndo />}
			/>
			<MenuBarButton
				className='syntax-button'
				isActiveArg='bold'
				editorFunc={'toggleBold'}
				editor={editor}
				content={<FaBold />}
			/>
			<MenuBarButton
				className='syntax-button'
				isActiveArg={'italic'}
				editorFunc={'toggleItalic'}
				editor={editor}
				content={<FaItalic />}
			/>
			<MenuBarButton
				className='syntax-button'
				isActiveArg={'underline'}
				editorFunc={'toggleUnderline'}
				editor={editor}
				content={<FaUnderline />}
			/>
			<MenuBarButton
				className='syntax-button'
				isActiveArg={'strike'}
				editorFunc={'toggleStrike'}
				editor={editor}
				content={<FaStrikethrough />}
			/>
			<MenuBarButton
				className='syntax-button'
				isActiveArg={'bulletList'}
				editorFunc={'toggleBulletList'}
				editor={editor}
				content={<FaListUl />}
			/>
			<MenuBarButton
				className='syntax-button'
				isActiveArg={'orderedList'}
				editorFunc={'toggleOrderedList'}
				editor={editor}
				content={<FaListOl />}
			/>
			<MenuBarButton
				className='syntax-button'
				isActiveArg={{ textAlign: 'right' }}
				editorFunc={'setTextAlign'}
				editorFuncArg={'right'}
				editor={editor}
				content={<FaAlignRight />}
			/>
			<MenuBarButton
				className='syntax-button'
				isActiveArg={{ textAlign: 'center' }}
				editorFunc={'setTextAlign'}
				editorFuncArg={'center'}
				editor={editor}
				content={<FaAlignCenter />}
			/>
			<MenuBarButton
				className='syntax-button'
				isActiveArg={{ textAlign: 'left' }}
				editorFunc={'setTextAlign'}
				editorFuncArg={'left'}
				editor={editor}
				content={<FaAlignLeft />}
			/>
			<MenuBarButton
				className='syntax-button'
				isActiveArg={{ textAlign: 'justify' }}
				editorFunc={'setTextAlign'}
				editorFuncArg={'justify'}
				editor={editor}
				content={<FaAlignJustify />}
			/>
			<MenuBarButton
				className='syntax-button'
				isActiveArg={{ dir: 'rtl' }}
				editorFunc={'setTextDirection'}
				editorFuncArg={'rtl'}
				editor={editor}
				content={<MdOutlineFormatTextdirectionRToL />}
			/>
			<MenuBarButton
				className='syntax-button'
				isActiveArg={{ dir: 'ltr' }}
				editorFunc={'setTextDirection'}
				editorFuncArg={'ltr'}
				editor={editor}
				content={<MdFormatTextdirectionLToR />}
			/>
			<MenuBarSelect editor={editor} />
		</div>
	)
}

export default MenuBar
