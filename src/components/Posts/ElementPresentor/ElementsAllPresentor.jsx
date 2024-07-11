import ElementPresentor from "./ElementPresentor";

const ElementsAllPresentor = (props) => {
	const { elements } = props
	return (
		<>
			{elements.map((element, index) => (
				<ElementPresentor key={`element-${index}`} element={element} last={index === elements.length - 1}/>
			))}
		</>
	)
}