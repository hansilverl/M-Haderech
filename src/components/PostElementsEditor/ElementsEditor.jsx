import './ElementsEditor.css'

import React, { useState } from 'react'
import {
	DndContext,
	closestCenter,
	MouseSensor,
	TouchSensor,
	KeyboardSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'

import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import ElementEditor from './ElementEditor/ElementEditor'

import { deleteObjectByFilePath } from '../../hooks/useResourcesMgmt'

const ElementsEditor = (props) => {
	const { postID, elements, setElements, setForceSave } = props
	const [dragging, setDragging] = useState(false)
	
	const createElement = () => {
		let id = 0
		while (elements.find((elem) => elem.id === `draggable-item-${id}`)) id++

		const newElement = {
			type: 'text',
			content: '',
			resourcePath: '',
			resourceList: [],
			displayEditor: true,
			internalIndex: id,
			dimensions: null,
			id: `draggable-item-${id}`,
		}

		setElements([...elements, newElement])
	}

	const updateElement = (element) => {
		const index = elements.findIndex((elem) => elem.id === element.id)
		const newElements = [...elements]
		const oldElement = newElements[index]
		newElements[index] = element
		setElements(newElements)
		if (oldElement.resourcePath !== element.resourcePath) setForceSave(true)
	}

	const deleteElement = (element) => {
		const resourcePath = element.resourcePath
		if (resourcePath && resourcePath !== '') deleteObjectByFilePath(resourcePath)

		const index = elements.findIndex((elem) => {
			return elem.id === element.id
		})
		if (index < 0) return

		const newElements = [...elements]
		newElements.splice(index, 1)
		setElements(newElements)
	}

	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	const handleDragStart = (event) => {
		console.log(event?.active?.id)
		if (event?.active?.id.includes('draggable-item')) setDragging(true)
	}

	const handleDragEnd = (event) => {
		const { active, over, id } = event
		if (!dragging) return

		setDragging(false)
		if (!over || active.id === over.id) return
		const newElements = [...elements]
		const oldIndex = newElements.findIndex((elem) => elem.id === active.id)
		const newIndex = newElements.findIndex((elem) => elem.id === over.id)

		const item = newElements.splice(oldIndex, 1)[0]
		newElements.splice(newIndex, 0, item)

		setElements(newElements)
	}

	return (
		<div className='element-editors-container'>
			<DndContext
				id='element-editors-dnd-context'
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}>
				<SortableContext items={elements} strategy={verticalListSortingStrategy}>
					{elements.map((element, index) => {
						return (
							<ElementEditor
								key={`${postID}-${element.id}`}
								index={index}
								element={element}
								updateElement={updateElement}
								deleteElement={deleteElement}
								forceHideEditor={dragging}
							/>
						)
					})}
				</SortableContext>
			</DndContext>
			<button className='add-element-button' onClick={createElement}>
				הוספת רכיב
			</button>
		</div>
	)
}

export default ElementsEditor
