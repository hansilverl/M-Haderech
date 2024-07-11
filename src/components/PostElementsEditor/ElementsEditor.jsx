import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import ElementEditor from './ElementEditor/ElementEditor'

const ElementsEditor = (props) => {
	const { id, elements, setElements, setSave } = props

	const onDragEnd = (result) => {
		if (!result.destination) {
			return
		}

		setElements((elem) => {
			const reorderedElements = Array.from(elem)
			const [removed] = reorderedElements.splice(result.source.index, 1)
			reorderedElements.splice(result.destination.index, 0, removed)
			return reorderedElements
		})

		setSave(true)
	}

	const onAddElement = () => {
		const newElement = {
			type: 'text',
			content: '',
			resourcePath: '',
			displayEditor: true,
		}
		setElements((elem) => [...elem, newElement])
	}

	return (
		<DragDropContext id={`context-${id}`} onDragEnd={onDragEnd}>
			<Droppable droppableId={`droppable-${id}`}>
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{elements.map((element, index) => (
							<ElementEditor
								key={`element-${id}-${index}`}
								index={index}
								element={element}
								setElements={setElements}
								setSave={setSave}
							/>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
			<button onClick={onAddElement}>הוסף</button>
		</DragDropContext>
	)
}

export default ElementsEditor
