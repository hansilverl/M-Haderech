import React, { useEffect, useRef, useState } from 'react'
import { FaGripLines } from 'react-icons/fa'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import Selector from '../../Selector/Selector'
import TextEditor from '../../TextEditor/TextEditor'
import ResourceInput from '../../ResourceInput/ResourceInput'
import { deleteObjectByFilePath } from '../../../hooks/useResourceManagement'
import './ElementEditor.css'

const typeValues = ['text', 'image', 'video', 'audio', 'pdf', 'other']
const typeNames = ['טקסט', 'תמונה', 'וידאו', 'אודיו', 'pdf', 'אחר']

const ElementComp = (props) => {
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
	const { element, deleteHandler, updateElement } = props
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: element?.id,
	})

	const autoSaveTimeout = useRef(null)
	const [elem, setElement] = useState(element)
	const [type, setType] = useState(elem.type)
	const [content, setContent] = useState(elem.content)
	const [resourcePath, setResourcePath] = useState(elem.resourcePath)
	const [displayEditor, setDisplayEditor] = useState(elem.displayEditor)

	const onDeleteElement = () => {
		if (resourcePath && resourcePath !== '') deleteObjectByFilePath(resourcePath)
		deleteHandler(elem.id)
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
		}, 2000)
	}, [type, content, resourcePath, displayEditor])

	useEffect(() => {
		updateElement(elem)
	}, [elem])

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div ref={setNodeRef} style={style} {...attributes}>
			<div className='element-editor-header main-flex-row'>
				<span className='drag-handle' {...listeners}>
					☰
				</span>
				<Selector
					selectFunction={setType}
					optionValues={typeValues}
					optionNames={typeNames}
					currentValue={type}
					disabled={resourcePath && resourcePath !== '' ? true : false}
				/>
				<button onClick={toggleDisplayEditor}>{displayEditor ? 'הסתר' : 'הצג'}</button>
				<button onClick={onDeleteElement}>מחק</button>
			</div>

			<div className='element-editor-container'>
				{!displayEditor ? null : (
					<ElementComp
						type={type}
						content={content}
						resourcePath={resourcePath}
						setContent={setContent}
						setResourcePath={setResourcePath}
					/>
				)}
			</div>
		</div>
	)
}

export default ElementEditor
