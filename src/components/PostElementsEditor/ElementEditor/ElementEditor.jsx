import './ElementEditor.css'

import React, { useEffect, useRef, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import Selector from '../../Selector/Selector'
import TextEditor from '../../TextEditor/TextEditor'
import ResourceInput from '../../ResourceInput/ResourceInput'
import GeneralModal from '../../GeneralModal/GeneralModal'

import ResizableComponent from '../ResizableResourceComponent/ResizableResourceComponent'

const typeValues = ['text', 'image', 'video', 'audio', 'pdf', 'other']
const typeNames = ['טקסט', 'תמונה', 'וידאו', 'אודיו', 'pdf', 'אחר']

const ElementEditorComp = (props) => {
	const { type, content, setContent, resourcePath, setResourcePath, dimensions, setDimensions } =
		props

	const [url, setUrl] = useState(null)

	const index = typeValues.indexOf(type)
	if (index < 0) {
		return <h2>שגיאה בטעינת עורך האלמנט</h2>
	}

	return (
		<div className='element-comp-container'>
			{type === 'text' ? (
				<TextEditor content={content} setContent={setContent} />
			) : (
				<>
					<ResourceInput
						type={type}
						path={resourcePath}
						setPath={setResourcePath}
						title={typeNames[index]}
						url={url}
						setUrl={setUrl}
					/>
					<ResizableComponent
						mediaType={type}
						src={url}
						dimensions={dimensions}
						setDimensions={setDimensions}
					/>
				</>
			)}
		</div>
	)
}

const ElementEditor = (props) => {
	const { element, deleteElement, updateElement, forceHideEditor } = props
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: element?.id,
	})

	const autoSaveTimeout = useRef(null)

	const firstRenderRef = useRef(true)
	const [elem, setElement] = useState(element)
	const [type, setType] = useState(elem.type)
	const [content, setContent] = useState(elem.content)
	const [resourcePath, setResourcePath] = useState(elem.resourcePath)
	const [displayEditor, setDisplayEditor] = useState(elem.displayEditor)
	const [dimensions, setDimensions] = useState(elem.dimensions ? elem.dimensions : null)
	const [isModalActive, setIsModalActive] = useState(false)

	const onDeleteElement = () => {
		setIsModalActive(false)
		deleteElement(element)
	}

	const toggleDisplayEditor = () => {
		setDisplayEditor(!displayEditor)
	}

	useEffect(() => {
		if (firstRenderRef.current) {
			firstRenderRef.current = false
			return
		}
		const onUpdateElement = () => {
			if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current)
			autoSaveTimeout.current = null
			setElement((elem) => {
				const newElem = { ...elem }
				newElem.type = type
				newElem.content = content
				newElem.resourcePath = resourcePath
				newElem.displayEditor = displayEditor
				newElem.dimensions = dimensions
				return newElem
			})
		}

		if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current)

		autoSaveTimeout.current = setTimeout(() => {
			onUpdateElement()
		}, 1000)
	}, [type, content, resourcePath, displayEditor, dimensions])

	useEffect(() => {
		if (elem != element) updateElement(elem)
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
				<button onClick={toggleDisplayEditor}>{displayEditor ? 'הסתר' : 'הצג'} עורך</button>
				<button onClick={() => setIsModalActive(true)}>מחק רכיב</button>
			</div>
			{!displayEditor || forceHideEditor ? null : (
				<ElementEditorComp
					type={type}
					content={content}
					resourcePath={resourcePath}
					dimensions={dimensions}
					setContent={setContent}
					setResourcePath={setResourcePath}
					setDimensions={setDimensions}
				/>
			)}
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
