import React from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import ElementEditor from './ElementEditor/ElementEditor'

const ElementsEditor = (props) => {
	const { id, elements, setElements, setSave } = props

	const onDragEnd = (result) => {
		if (!result.destination) {
			return
		}

		const reorderedElements = Array.from(elements)
		const [removed] = reorderedElements.splice(result.source.index, 1)
		reorderedElements.splice(result.destination.index, 0, removed)
		setElements(reorderedElements)
	}

	const onAddElement = () => {
		const newElement = {
			type: 'text',
			content: '',
			resourcePath: '',
		}
		setElements((elements) => [...elements, newElement])
	}

	return (
		<DragDropContext id={`context-${id}`} className='elements-editor' onDragEnd={onDragEnd}>
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
