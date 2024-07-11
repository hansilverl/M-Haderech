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

const ElementsEditor = (props) => {
	const { elements, setElements } = props
	const [originalDisplay, setOriginalDisplay] = useState({})

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
		const confirmDelete = window.confirm('האם אתה בטוח שברצונך למחוק את הפוסט?')
		if (!confirmDelete) return

		const index = elements.findIndex((elem) => elem.id === element.id)
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
		const newOriginalDisplay = {}
		const newElements = elements.map((element) => {
			newOriginalDisplay[element.id] = element.displayEditor
			return { ...element, displayEditor: false }
		})
		setOriginalDisplay(newOriginalDisplay)
		setElements(newElements)
	}

	const handleDragEnd = (event) => {
		const { active, over } = event
		const newElements = elements.map((element) => {
			const originalValue = originalDisplay[element.id]
			return { ...element, displayEditor: originalValue }
		})

		if (!over || active.id === over.id) return
		const oldIndex = newElements.findIndex((elem) => elem.id === active.id)
		const newIndex = newElements.findIndex((elem) => elem.id === over.id)

		const item = newElements.splice(oldIndex, 1)[0]
		newElements.splice(newIndex, 0, item)
		setElements(newElements)
	}

	useEffect(() => {
		console.log(elements)
	}, [elements])

	return (
		<>
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
							/>
						)
					})}
				</SortableContext>
			</DndContext>
			<button onClick={createElement}>הוסף</button>
		</>
	)
}

export default ElementsEditor
