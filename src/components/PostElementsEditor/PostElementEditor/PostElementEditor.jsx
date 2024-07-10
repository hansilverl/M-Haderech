import React, { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { FaGripLines } from 'react-icons/fa'
import Selector from '../Selector/Selector'

import './PostElementEditor.css'

const PostElementEditor = (props) => {
	const { index, element, setElements } = props

	const [currentElement, setCurrenElement] = useState(element)
	const [elementType, setElementType] = useState(element?.type ? element.type : 'text')

	const typeValues = ['text', 'image', 'video', 'audio']
	const typeNames = ['טקסט', 'תמונה', 'וידאו', 'אודיו']

	const onUpdateElement = (newElement) => {
		setElements((elements) => {
			const newElements = [...elements]
			newElements[index] = newElement
			return newElements
		})
	}

	return (
		<Draggable className='draggable-post-element' draggableId={element.id} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					style={{ ...provided.draggableProps.style }}>
					<span>{item.content}</span>
					<span {...provided.dragHandleProps} className='drag-handle'>
						<FaGripLines />
					</span>
					<Selector
						id={`element-${element.id}`}
						selectFunction={setElementType}
						optionValues={typeValues}
						optionNames={typeNames}
						currentValue={elementType}
					/>
				</div>
			)}
		</Draggable>
	)
}

export default PostElementEditor
