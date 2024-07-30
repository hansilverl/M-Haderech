import './ResourceListEditor.css'

import React, { useState } from 'react'

import { useDroppable, useDraggable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const DraggableResource = (props) => {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: `draggable-resource-${props.id}`,
	})

	const style = {
		transform: CSS.Translate.toString(transform),
	}

	return <button ref={setNodeRef} style={style} {...listeners} {...attributes}></button>
}

const ResourceListEditor = (props) => {
	const { type, resourcesPaths, setResourcesPaths, urls } = props
	const { isOver, setNodeRef } = useDroppable({
		id: 'droppable',
	})
	const style = {
		color: isOver ? 'green' : undefined,
	}

	return (
		<div ref={setNodeRef} style={style}>
			<DraggableResource id={1} />
			<DraggableResource id={2} />
		</div>
	)
}

export default ResourceListEditor
