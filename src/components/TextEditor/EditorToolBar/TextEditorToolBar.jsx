import './TextEditorToolBar.css'

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

import { FaLink, FaUnlink } from 'react-icons/fa'

import { MdOutlineFormatTextdirectionRToL, MdFormatTextdirectionLToR } from 'react-icons/md'

import ToolBarButton from './EditorToolBarButton/ToolBarButton'
import MenuBarSelectSize from './EditorToolBarSelect/MenuBarSelect'

const TextEditorToolBar = (props) => {
	const { editor } = props

	if (!editor) {
		return null
	}

	return (
		<div className='text-editor-menu-bar' editor={editor}>
			<div className='sub-menu-bar'>
				<ToolBarButton
					className='use-button'
					editorFunc={'undo'}
					editor={editor}
					content={<FaRedo />}
				/>
				<ToolBarButton
					className='use-button'
					editorFunc={'redo'}
					editor={editor}
					content={<FaUndo />}
				/>
				<ToolBarButton
					className='syntax-button'
					isActiveArg='bold'
					editorFunc={'toggleBold'}
					editor={editor}
					content={<FaBold />}
				/>
				<ToolBarButton
					className='syntax-button'
					isActiveArg={'italic'}
					editorFunc={'toggleItalic'}
					editor={editor}
					content={<FaItalic />}
				/>
				<ToolBarButton
					className='syntax-button'
					isActiveArg={'underline'}
					editorFunc={'toggleUnderline'}
					editor={editor}
					content={<FaUnderline />}
				/>
				<ToolBarButton
					className='syntax-button'
					isActiveArg={'strike'}
					editorFunc={'toggleStrike'}
					editor={editor}
					content={<FaStrikethrough />}
				/>
				<ToolBarButton
					className='syntax-button'
					isActiveArg={'bulletList'}
					editorFunc={'toggleBulletList'}
					editor={editor}
					content={<FaListUl />}
				/>
				<ToolBarButton
					className='syntax-button'
					isActiveArg={'orderedList'}
					editorFunc={'toggleOrderedList'}
					editor={editor}
					content={<FaListOl />}
				/>
				<ToolBarButton
					className='syntax-button'
					isActiveArg={{ textAlign: 'right' }}
					editorFunc={'setTextAlign'}
					editorFuncArg={'right'}
					editor={editor}
					content={<FaAlignRight />}
				/>
				<ToolBarButton
					className='syntax-button'
					isActiveArg={{ textAlign: 'center' }}
					editorFunc={'setTextAlign'}
					editorFuncArg={'center'}
					editor={editor}
					content={<FaAlignCenter />}
				/>
				<ToolBarButton
					className='syntax-button'
					isActiveArg={{ textAlign: 'left' }}
					editorFunc={'setTextAlign'}
					editorFuncArg={'left'}
					editor={editor}
					content={<FaAlignLeft />}
				/>
				<ToolBarButton
					className='syntax-button'
					isActiveArg={{ textAlign: 'justify' }}
					editorFunc={'setTextAlign'}
					editorFuncArg={'justify'}
					editor={editor}
					content={<FaAlignJustify />}
				/>
				<ToolBarButton
					className='syntax-button'
					isActiveArg={{ dir: 'rtl' }}
					editorFunc={'setTextDirection'}
					editorFuncArg={'rtl'}
					editor={editor}
					content={<MdOutlineFormatTextdirectionRToL />}
				/>
				<ToolBarButton
					className='syntax-button'
					isActiveArg={{ dir: 'ltr' }}
					editorFunc={'setTextDirection'}
					editorFuncArg={'ltr'}
					editor={editor}
					content={<MdFormatTextdirectionLToR />}
				/>
			</div>
			<div className='sub-menu-bar'>
				<ToolBarButton
					className='syntax-button'
					isActiveArg={{ dir: 'ltr' }}
					editorFunc={['extendMarkRange', setLink]}
					editorFuncArg={'ltr'}
					editor={editor}
					content={<MdFormatTextdirectionLToR />}
				/>
				<MenuBarSelectSize editor={editor} />
			</div>
		</div>
	)
}

export default TextEditorToolBar
