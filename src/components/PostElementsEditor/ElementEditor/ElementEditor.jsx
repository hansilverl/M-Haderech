import React, { useEffect, useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { FaGripLines } from 'react-icons/fa'
import Selector from '../../Selector/Selector'

import './ElementEditor.css'
import TextEditor from '../../TextEditor/TextEditor'
import ResourceInput from '../../ResourceInput/ResourceInput'
import { deleteObjectByFilePath } from '../../../hooks/useResourceManagement'

const typeValues = ['text', 'image', 'video', 'audio', 'compressed']
const typeNames = ['טקסט', 'תמונה', 'וידאו', 'אודיו', 'מקווץ']

const ElementComp = (props) => {
	const { type, content, setContent, resourcePath, setResourcePath } = props

	const index = typeValues.indexOf(type)
	if (index < 0) {
		return <h2>שגיאה בטעינת עורך האלמנט</h2>
	}
	if (type === 'text') {
		return <TextEditor initialContent={content} setCurrContent={setContent} />
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
	const { index, element, setElements, setSave } = props

	const [type, setType] = useState(element?.type ? element.type : 'text')
	const [content, setContent] = useState(element?.content ? element.content : '')
	const [resourcePath, setResourcePath] = useState(
		element?.resourcePath ? element.resourcePath : ''
	)

	const [displayEditor, setDisplayEditor] = useState(true)

	const onUpdateElement = () => {
		const newElement = {
			type,
			content,
			resourcePath,
		}
		setElements((elements) => {
			const newElements = [...elements]
			newElements[index] = newElement
			return newElements
		})

		setSave(true)
	}

	const onDeleteElement = () => {
		if (resourcePath && resourcePath !== '') deleteObjectByFilePath(resourcePath)
		setElements((elements) => {
			const newElements = [...elements]
			newElements.splice(index, 1)
			return newElements
		})
	}

	const handleHideEditor = () => {
		setDisplayEditor(!displayEditor)
	}

	useEffect(() => {
		if (
			type !== element.type ||
			content !== element.content ||
			resourcePath !== element.resourcePath
		) {
			onUpdateElement()
		}
	}, [type, content, resourcePath])

	return (
		<Draggable className='draggable-post-element' draggableId={`drag-${index}`} index={index}>
			{(provided) => (
				<div
					className='draggable-post-element main-flex-col'
					ref={provided.innerRef}
					{...provided.draggableProps}
					style={{ ...provided.draggableProps.style }}>
					<div className='main-flex-row'>
						<span {...provided.dragHandleProps} className='drag-handle'>
							<FaGripLines />
						</span>
						<Selector
							id={`element-${index}-type-selector`}
							selectFunction={setType}
							optionValues={typeValues}
							optionNames={typeNames}
							currentValue={type}
							disabled={resourcePath && resourcePath !== '' ? true : false}
						/>
						<button onClick={handleHideEditor}>{displayEditor ? 'הסתר' : 'הצג'}</button>
						<button onClick={onDeleteElement}>מחק</button>
					</div>

					<div className='element-editor'>
						{!displayEditor ? null : (
							<>
								<ElementComp
									type={type}
									content={content}
									resourcePath={resourcePath}
									setContent={setContent}
									setResourcePath={setResourcePath}
									setElements={setElements}
								/>
							</>
						)}
					</div>
				</div>
			)}
		</Draggable>
	)
}

export default ElementEditor
