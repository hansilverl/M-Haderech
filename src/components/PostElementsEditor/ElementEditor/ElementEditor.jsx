import React, { useEffect, useRef, useState } from 'react'
import { FaGripLines } from 'react-icons/fa'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import Selector from '../../Selector/Selector'
import TextEditor from '../../TextEditor/TextEditor'
import ResourceInput from '../../ResourceInput/ResourceInput'
import GeneralModal from '../../Modals/GeneralModal'

import './ElementEditor.css'

const typeValues = ['text', 'image', 'video', 'audio', 'pdf', 'other']
const typeNames = ['טקסט', 'תמונה', 'וידאו', 'אודיו', 'pdf', 'אחר']

const ElementEditorComp = (props) => {
	const { type, content, setContent, resourcePath, setResourcePath } = props

	const index = typeValues.indexOf(type)
	if (index < 0) {
		return <h2>שגיאה בטעינת עורך האלמנט</h2>
	}
	if (type === 'text') {
		return <TextEditor content={content} setContent={setContent} />
	}
	return (
		<ResourceInput
			type={type}
			path={resourcePath}
			setPath={setResourcePath}
			title={typeNames[index]}
		/>
	)
}

const ElementEditor = (props) => {
	const { element, deleteElement, updateElement, forceHideEditor } = props
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: element?.id,
	})

	const autoSaveTimeout = useRef(null)
	const [elem, setElement] = useState(element)
	const [type, setType] = useState(elem.type)
	const [content, setContent] = useState(elem.content)
	const [resourcePath, setResourcePath] = useState(elem.resourcePath)
	const [displayEditor, setDisplayEditor] = useState(elem.displayEditor)

	const [isModalActive, setIsModalActive] = useState(false)

	const onDeleteElement = () => {
		setIsModalActive(false)
		deleteElement(element)
	}

	const toggleDisplayEditor = () => {
		setDisplayEditor(!displayEditor)
	}

	useEffect(() => {
		const onUpdateElement = () => {
			if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current)
			autoSaveTimeout.current = null
			setElement((elem) => {
				const newElem = { ...elem }
				newElem.type = type
				newElem.content = content
				newElem.resourcePath = resourcePath
				newElem.displayEditor = displayEditor
				return newElem
			})
		}

		if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current)

		autoSaveTimeout.current = setTimeout(() => {
			onUpdateElement()
		}, 1000)
	}, [type, content, resourcePath, displayEditor])

	useEffect(() => {
		updateElement(elem)
	}, [elem])

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div ref={setNodeRef} style={style} {...attributes} className='element-editor-container'>
			<div className='element-editor-header'>
				<span className='drag-handle' {...listeners}>
					☰
				</span>
				<Selector
					selectFunction={setType}
					optionValues={typeValues}
					optionNames={typeNames}
					currentValue={type}
					name='סוג הרכיב'
					disabled={resourcePath && resourcePath !== '' ? true : false}
				/>
				<button onClick={toggleDisplayEditor}>{displayEditor ? 'הסתר' : 'הצג'}</button>
				<button onClick={() => setIsModalActive(true)}>מחק</button>
			</div>
			<div className='element-editor-container' display={displayEditor ? 'block' : 'none'}>
				{!displayEditor || forceHideEditor ? null : (
					<ElementEditorComp
						type={type}
						content={content}
						resourcePath={resourcePath}
						setContent={setContent}
						setResourcePath={setResourcePath}
					/>
				)}
			</div>
			<GeneralModal
				isOpen={isModalActive}
				onRequestClose={() => setIsModalActive(false)}
				title='האם אתה בטוח למחוק רכיב זה?'
				confirmName='מחק'
				cancelName='ביטול'
				handleCancel={() => setIsModalActive(false)}
				handleConfirm={() => onDeleteElement()}>
				<h3>לא יהיה ניתן לשחזר את הרכיב או התוכן שלו</h3>
				<h3>האם אתה בטוח שברצונך להמשיך?</h3>
			</GeneralModal>
		</div>
	)
}

export default ElementEditor
