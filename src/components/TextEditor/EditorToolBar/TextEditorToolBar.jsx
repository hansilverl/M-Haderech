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
import ToolBarLinkButton from './EditorToolBarButton/ToolBarLinkButton'
import MenuBarSelectSize from './EditorToolBarSelect/MenuBarSelect'

const TextEditorToolBar = (props) => {
	const { editor } = props

	if (!editor) {
		return null
	}

	return (
		<div className='text-editor-menu-bar' editor={editor}>
			<div className='first-two-mb'>
			<div className={'sub-menu-bar'}>
				<div className='sub-group'>
					<ToolBarButton
						tooltipText='ביטול'
						className='use-button'
						editorFunc={'undo'}
						editor={editor}
						content={<FaRedo />}
					/>
					<ToolBarButton
						tooltipText='שחזור'
						className='use-button'
						editorFunc={'redo'}
						editor={editor}
						content={<FaUndo />}
					/>
				</div>
				<div className='sub-group'>
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
				</div>
				<div className='sub-group'>
					<ToolBarButton
						tooltipText='רשימת נקודות'
						className='syntax-button'
						isActiveArg={'bulletList'}
						editorFunc={'toggleBulletList'}
						editor={editor}
						content={<FaListUl />}
					/>
					<ToolBarButton
						tooltipText='רשימה ממוספרת'
						className='syntax-button'
						isActiveArg={'orderedList'}
						editorFunc={'toggleOrderedList'}
						editor={editor}
						content={<FaListOl />}
					/>
				</div>
			</div>

			<div className='sub-menu-bar'>
				<div className='sub-group'>
					<ToolBarButton
						tooltipText='כיוון טקסט מימין לשמאל'
						className='syntax-button'
						isActiveArg={{ dir: 'rtl' }}
						editorFunc={'setTextDirection'}
						editorFuncArg={'rtl'}
						editor={editor}
						content={<MdOutlineFormatTextdirectionRToL />}
					/>
					<ToolBarButton
						tooltipText='כיוון טקסט משמאל לימין'
						className='syntax-button'
						isActiveArg={{ dir: 'ltr' }}
						editorFunc={'setTextDirection'}
						editorFuncArg={'ltr'}
						editor={editor}
						content={<MdFormatTextdirectionLToR />}
					/>
				</div>
				<div className='sub-group'>
					<ToolBarButton
						tooltipText='הצמדת טקסט לימין'
						className='syntax-button'
						isActiveArg={{ textAlign: 'right' }}
						editorFunc={'setTextAlign'}
						editorFuncArg={'right'}
						editor={editor}
						content={<FaAlignRight />}
					/>
					<ToolBarButton
						tooltipText='הצמדת טקסט למרכז'
						className='syntax-button'
						isActiveArg={{ textAlign: 'center' }}
						editorFunc={'setTextAlign'}
						editorFuncArg={'center'}
						editor={editor}
						content={<FaAlignCenter />}
					/>
					<ToolBarButton
						tooltipText='הצמדת טקסט לשמאל'
						className='syntax-button'
						isActiveArg={{ textAlign: 'left' }}
						editorFunc={'setTextAlign'}
						editorFuncArg={'left'}
						editor={editor}
						content={<FaAlignLeft />}
					/>
					<ToolBarButton
						tooltipText='הצמדת טקסט למלא'
						className='syntax-button'
						isActiveArg={{ textAlign: 'justify' }}
						editorFunc={'setTextAlign'}
						editorFuncArg={'justify'}
						editor={editor}
						content={<FaAlignJustify />}
					/>
				</div>
				<div className='sub-group'>
					<ToolBarLinkButton
						tooltipText='הוספת קישור'
						className='use-button'
						isActiveArg={'link'}
						editorFunc={'setLink'}
						editor={editor}
						content={<FaLink />}
					/>
					<ToolBarLinkButton
						tooltipText='הסרת קישור'
						className='use-button'
						isActiveArg={'link'}
						editorFunc={'unsetLink'}
						editor={editor}
						content={<FaUnlink />}
					/>
				</div>
			</div>
			</div>
			<div className='sub-menu-bar'>
				<MenuBarSelectSize editor={editor} />
			</div>
		</div>
	)
}

export default TextEditorToolBar
