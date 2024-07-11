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
		<div className='menu-bar' editor={editor}>
			<div className='sub-menu-bar'>
				<MenuBarButton
					className='use-button'
					editorFunc={'undo'}
					editor={editor}
					content={<FaRedo />}
				/>
				<MenuBarButton
					className='menu-bar-button use-button'
					editorFunc={'redo'}
					editor={editor}
					content={<FaUndo />}
				/>
				<MenuBarButton
					isActiveArg='bold'
					editorFunc={'toggleBold'}
					editor={editor}
					content={<FaBold />}
				/>
				<MenuBarButton
					isActiveArg={'italic'}
					editorFunc={'toggleItalic'}
					editor={editor}
					content={<FaItalic />}
				/>
				<MenuBarButton
					isActiveArg={'underline'}
					editorFunc={'toggleUnderline'}
					editor={editor}
					content={<FaUnderline />}
				/>
				<MenuBarButton
					isActiveArg={'strike'}
					editorFunc={'toggleStrike'}
					editor={editor}
					content={<FaStrikethrough />}
				/>
				<MenuBarButton
					isActiveArg={'bulletList'}
					editorFunc={'toggleBulletList'}
					editor={editor}
					content={<FaListUl />}
				/>
				<MenuBarButton
					isActiveArg={'orderedList'}
					editorFunc={'toggleOrderedList'}
					editor={editor}
					content={<FaListOl />}
				/>
				<MenuBarButton
					isActiveArg={{ textAlign: 'right' }}
					editorFunc={'setTextAlign'}
					editorFuncArg={'right'}
					editor={editor}
					content={<FaAlignRight />}
				/>
				<MenuBarButton
					isActiveArg={{ textAlign: 'center' }}
					editorFunc={'setTextAlign'}
					editorFuncArg={'center'}
					editor={editor}
					content={<FaAlignCenter />}
				/>
				<MenuBarButton
					isActiveArg={{ textAlign: 'left' }}
					editorFunc={'setTextAlign'}
					editorFuncArg={'left'}
					editor={editor}
					content={<FaAlignLeft />}
				/>
				<MenuBarButton
					isActiveArg={{ textAlign: 'justify' }}
					editorFunc={'setTextAlign'}
					editorFuncArg={'justify'}
					editor={editor}
					content={<FaAlignJustify />}
				/>
				<MenuBarButton
					isActiveArg={{ dir: 'rtl' }}
					editorFunc={'setTextDirection'}
					editorFuncArg={'rtl'}
					editor={editor}
					content={<MdOutlineFormatTextdirectionRToL />}
				/>
				<MenuBarButton
					isActiveArg={{ dir: 'ltr' }}
					editorFunc={'setTextDirection'}
					editorFuncArg={'ltr'}
					editor={editor}
					content={<MdFormatTextdirectionLToR />}
				/>
				<MenuBarSelect editor={editor} />
			</div>
		</div>
	)
}

export default MenuBar
