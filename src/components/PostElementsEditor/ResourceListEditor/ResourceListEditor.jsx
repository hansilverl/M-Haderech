import './ResourceListEditor.css'

import React, { useEffect, useState } from 'react'

import {
	DndContext,
	useSensors,
	useSensor,
	MouseSensor,
	TouchSensor,
	KeyboardSensor,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const arrayMove = (array, from, to) => {
	const newArray = array.slice()

	const temp = newArray[from]
	newArray[from] = newArray[to]
	newArray[to] = temp

	return newArray
}

const DraggableResource = (props) => {
	const { id } = props
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		padding: '10px',
		border: '1px solid #ccc',
		marginBottom: '5px',
		backgroundColor: '#f9f9f9',
	}

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			Item {id}
		</div>
	)
}

const ResourceListEditor = (props) => {
	const { elementID, type, resourceList, setResourceList, setCurrentResource } = props
	const [items, setItems] = useState([1, 2, 3, 4, 5])

	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	const handleDragEnd = (event) => {
		const { active, over } = event
		if (active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.indexOf(active.id)
				const newIndex = items.indexOf(over.id)
				return arrayMove(items, oldIndex, newIndex)
			})
		}
	}

	const handleDragStart = (event) => {
		if (event?.active?.id.includes('draggable-item'))
			setCurrentResource(items.find((item) => item?.id === event?.active?.id))
	}

	return (
		<DndContext sensors={sensors} onDragEnd={handleDragEnd} on>
			<SortableContext items={items}>
				{items.map((id) => (
					<DraggableResource key={id} id={id} />
				))}
			</SortableContext>
		</DndContext>
	)
}

export default ResourceListEditor
