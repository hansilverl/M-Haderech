import './ElementsEditor.css'

import React, { useEffect, useState } from 'react'
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

import { deleteObjectByFilePath } from '../../hooks/useResourceManagement'

const ElementsEditor = (props) => {
	const { elements, setElements } = props
	const [dragging, setDragging] = useState(false)

	const createElement = () => {
		let id = 0
		while (elements.find((elem) => elem.id === `draggable-item-${id}`)) id++

		const newElement = {
			type: 'text',
			content: '',
			resourcePath: '',
			displayEditor: true,
			internalIndex: id,
			id: `draggable-item-${id}`,
		}

		setElements([...elements, newElement])
	}

	const updateElement = (element) => {
		const index = elements.findIndex((elem) => elem.id === element.id)
		const newElements = [...elements]
		newElements[index] = element
		setElements(newElements)
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
		setDragging(true)
	}

	const handleDragEnd = (event) => {
		const { active, over } = event

		if (!over || active.id === over.id) return
		const newElements = [...elements]
		const oldIndex = newElements.findIndex((elem) => elem.id === active.id)
		const newIndex = newElements.findIndex((elem) => elem.id === over.id)

		const item = newElements.splice(oldIndex, 1)[0]
		newElements.splice(newIndex, 0, item)
		setDragging(false)
		setElements(newElements)
	}

	return (
		<div className='element-editors-container'>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}>
				<SortableContext items={elements} strategy={verticalListSortingStrategy}>
					{elements.map((element, index) => {
						return (
							<ElementEditor
								key={element.id}
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
			<button onClick={createElement}>הוסף</button>
		</div>
	)
}

export default ElementsEditor
