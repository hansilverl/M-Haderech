import './ElementEditor.css'

import React, { useEffect, useRef, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import Selector from '../../Selector/Selector'
import TextEditor from '../../TextEditor/TextEditor'
import ResourceInput from '../../ResourceInput/ResourceInput'
import GeneralModal from '../../GeneralModal/GeneralModal'

import ResizableComponent from '../ResizableResourceComponent/ResizableResourceComponent'
import PdfViewer from '../../PdfViewer/PdfViewer'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsUpDownLeftRight } from '@fortawesome/free-solid-svg-icons'

const typeValues = ['text', 'image', 'video', 'audio', 'document', 'other']
const typeNames = ['טקסט', 'תמונה', 'וידאו', 'אודיו', 'מסמך pdf', 'אחר']

const ElementEditorComp = (props) => {
	const { type, content, setContent, resourcePath, setResourcePath, dimensions, setDimensions } =
		props

	const [url, setUrl] = useState(null)
	const [imageSize, setImageSize] = useState({ width: 800, height: 800 })

	const getImageSize = (url) => {
		const img = new Image()
		img.onload = () => {
			setImageSize({ width: img.width, height: img.height })
		}
		img.src = url
	}

	const index = typeValues.indexOf(type)

	useEffect(() => {
		if (type === 'image' && url) getImageSize(url)
	}, [url])

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
					{type === 'document' || type === 'pdf' ? (
						<PdfViewer pdfFile={url} />
					) : (
						<ResizableComponent
							mediaType={type}
							src={url}
							dimensions={dimensions}
							setDimensions={setDimensions}
							maxWidth={imageSize.width}
							maxHeight={imageSize.height}
						/>
					)}
				</>
			)}
		</div>
	)
}

const ElementEditor = (props) => {
	const { element, deleteElement, updateElement, forceHideEditor, setForceSave } = props
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

			let forceSave = false

			setElement((elem) => {
				const newElem = { ...elem }
				newElem.type = type
				if (type === 'pdf') newElem.type = 'document'
				newElem.content = content
				newElem.resourcePath = resourcePath
				newElem.displayEditor = displayEditor
				newElem.dimensions = dimensions
				return newElem
			})

			if (forceSave && setForceSave) setForceSave(true)
		}

		if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current)

		autoSaveTimeout.current = setTimeout(() => {
			onUpdateElement()
		}, 500)
	}, [type, content, resourcePath, displayEditor, dimensions])

	useEffect(() => {
		if (elem != element) updateElement(elem)
	}, [elem])

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	const deleteElementButtonHandler = () => {
		if (content === '' && resourcePath === '') {
			onDeleteElement()
			return
		}

		setIsModalActive(true)
	}

	return (
		<div ref={setNodeRef} style={style} {...attributes} className='element-editor-container'>
			<div className='element-editor-header'>
				<span className='drag-handle' {...listeners}>
					<FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
				</span>
				<Selector
					selectFunction={setType}
					optionValues={typeValues}
					optionNames={typeNames}
					currentValue={type}
					name='סוג הרכיב'
					disabled={resourcePath && resourcePath !== '' ? true : false}
				/>
				<div className='element-editor-buttons'>
					<button onClick={toggleDisplayEditor}>{displayEditor ? 'הסתרת' : 'הצגת'} עורך</button>
					<button onClick={deleteElementButtonHandler}>מחיקת רכיב</button>
				</div>
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
				isWarning={true}
				isOpen={isModalActive}
				onRequestClose={() => setIsModalActive(false)}
				title='האם אתה בטוח למחוק רכיב זה?'
				confirmName='מחיקה'
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
