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
import ElementGalleryPresentor from '../../PostElementPresentor/GalleryElementPresentor/GalleryElementPresentor'
import ResourceListEditor from '../ResourceListEditor/ResourceListEditor'

const typeValues = ['text', 'image', 'video', 'audio', 'document', 'gallery', 'other']
const typeNames = ['טקסט', 'תמונה', 'וידאו', 'אודיו', 'מסמך pdf', 'גלריה', 'אחר']

const ElementGalleryEditor = (props) => {
	const { type, resourcesPaths, setResourcesPaths } = props
	const [urls, setUrls] = useState([])

	return (
		<div className='element-comp-container'>
			{/* <ElementGalleryPresentor files={resourcesPaths} /> */}
			<ResourceListEditor />
			{/* <ResourceInput
				types={type}
				paths={resourcesPaths}
				setPaths={setResourcesPaths}
				urls={urls}
				setUrls={setUrls}
				title=''
				maxFiles={50}
			/> */}
		</div>
	)
}

const ElementResourceEditor = (props) => {
	const { type, resourcePath, setResourcePath, dimensions, setDimensions } = props
	const [urls, setUrls] = useState([])
	const [paths, setPaths] = useState(resourcePath && resourcePath !== '' ? [resourcePath] : null)
	const [imageSize, setImageSize] = useState(dimensions ? dimensions : { width: 800, height: 800 })

	const typeIndex = typeValues.indexOf(type)
	const typeName = typeIndex < 0 ? 'לא ידוע' : typeNames[typeIndex]

	const getImageSize = (url) => {
		const img = new Image()
		img.onload = () => setImageSize({ width: img.width, height: img.height })
		img.src = url
	}

	useEffect(() => {
		if (type === 'image' && urls && urls[0]) getImageSize(urls[0])
	}, [urls])

	useEffect(() => {
		if (paths && paths.length > 0 && paths[0] !== resourcePath) setResourcePath(paths[0])
		if (paths && paths.length <= 0) setResourcePath(null)
	}, [paths])

	return (
		<div className='element-comp-container'>
			<ResourceInput
				types={[type]}
				paths={paths}
				setPaths={setPaths}
				title={typeName}
				urls={urls}
				setUrls={setUrls}
				maxFiles={1}
			/>
			{(type === 'document' || type === 'pdf') && <PdfViewer pdfFile={urls[0]} />}
			{(type === 'image' || type === 'video' || type === 'audio') && (
				<ResizableComponent
					mediaType={type}
					src={urls[0]}
					dimensions={dimensions}
					setDimensions={setDimensions}
					maxWidth={imageSize.width}
					maxHeight={imageSize.height}
				/>
			)}
		</div>
	)
}

const ElementTextEditor = (props) => {
	const { content, setContent } = props
	return <TextEditor content={content} setContent={setContent} />
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
	const [resourcesPaths, setResourcesPaths] = useState(elem.resourcePath)
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

			let forceSave = resourcePath !== elem.resourcePath || resourcesPaths !== elem.resourcesPaths

			setElement((elem) => {
				const newElem = { ...elem }
				newElem.type = type
				if (type === 'pdf' || type === 'document') newElem.type = 'application'
				newElem.content = content
				newElem.resourcePath = resourcePath
				newElem.displayEditor = displayEditor
				newElem.dimensions = dimensions
				newElem.resourcesPaths = resourcesPaths

				return newElem
			})

			if (forceSave && setForceSave) setForceSave(true)
		}

		if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current)

		autoSaveTimeout.current = setTimeout(() => {
			onUpdateElement()
		}, 500)
	}, [type, content, resourcePath, resourcesPaths, displayEditor, dimensions])

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

	const displayTextEditor = displayEditor && !forceHideEditor && type === 'text'
	const displayGalleryEditor = displayEditor && !forceHideEditor && type === 'gallery'

	const displayResourceEditor =
		displayEditor && !forceHideEditor && !displayTextEditor && !displayGalleryEditor

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

			{displayTextEditor && <ElementTextEditor content={content} setContent={setContent} />}

			{displayResourceEditor && (
				<ElementResourceEditor
					key={`${element.id}-${type}`}
					resourcePath={resourcePath}
					setResourcePath={setResourcePath}
					setDisplayEditor={setDisplayEditor}
					setDimensions={setDimensions}
					dimensions={dimensions}
					type={type}
				/>
			)}

			{displayGalleryEditor && (
				<ElementGalleryEditor
					resourcesPaths={resourcesPaths}
					setResourcesPaths={setResourcesPaths}
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
