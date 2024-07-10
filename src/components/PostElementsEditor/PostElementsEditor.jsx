import React, { useState } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import PostElementEditor from './PostElementEditor/PostElementEditor'

const PostElementsEditor = (props) => {
	const { id, elements, setElements, setRefresh } = props

	const onDragEnd = (result) => {
		if (!result.destination) {
			return
		}

		const reorderedItems = Array.from(elements)
		const [removed] = reorderedItems.splice(result.source.index, 1)
		reorderedItems.splice(result.destination.index, 0, removed)
		setElements(elements)
	}

	return (
		<DragDropContext id={`context-${id}`} className='elements-editor' onDragEnd={onDragEnd}>
			<Droppable droppableId='post-elements'>
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{elements.map((element, index) => (
							<PostElementEditor
								key={`${element.id}-${index}`}
								index={index}
								element={element}
								setRefresh={setElements}
							/>
						))}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	)
}

export default PostElementsEditor
