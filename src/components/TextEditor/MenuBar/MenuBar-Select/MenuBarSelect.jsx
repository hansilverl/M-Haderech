import './MenuBarSelect.css'

const getFontSize = (elementType) => {
	// Create a temporary h1 element
	const tempH1 = document.createElement(elementType, { visibility: 'hidden' })
	tempH1.style.visibility = 'hidden' // Make it invisible
	document.body.appendChild(tempH1)

	// Get the computed font size
	const fontSize = window.getComputedStyle(tempH1).fontSize

	// Remove the temporary h1 element
	document.body.removeChild(tempH1)
	return fontSize
}

const MenuBarSelect = (props) => {
	const { editor } = props

	if (!editor) return null

	const onFontSizeChange = (e) => {
		if (!editor) return null

		const attributes = editor.getAttributes(editor.state.selection.$anchor.node().type.name)
		const fontSize = e.target.value
		for (let i = 1; i <= 6; i++) {
			if (editor.isActive('heading', { level: 1 }))
				editor.chain().focus().toggleHeading({ level: 1 }).run()
		}
		editor.chain().focus().setParagraph().run()

		switch (fontSize) {
			case 'h5':
				editor.chain().focus().toggleHeading({ level: 5 }).run()
				break
			case 'h4':
				editor.chain().focus().toggleHeading({ level: 4 }).run()
				break
			case 'h3':
				editor.chain().focus().toggleHeading({ level: 3 }).run()
				break
			case 'h2':
				editor.chain().focus().toggleHeading({ level: 2 }).run()
				break
			case 'h1':
				editor.chain().focus().toggleHeading({ level: 1 }).run()
				break
		}

		if (attributes?.textAlign) {
			editor.chain().focus().setTextAlign(attributes.textAlign).run()
		}
	}

	return (
		<select onChange={onFontSizeChange} className='editor-button'>
			<option value='h5' style={{ fontSize: `${getFontSize('h5')}` }}>
				קטן מאוד
			</option>
			<option value='p' style={{ fontSize: `${getFontSize('p')}` }}>
				קטן
			</option>
			<option value='h3' style={{ fontSize: `${getFontSize('h3')}` }}>
				בינוני
			</option>
			<option value='h2' style={{ fontSize: `${getFontSize('h2')}` }}>
				גדול
			</option>
			<option value='h1' style={{ fontSize: `${getFontSize('h1')}` }}>
				ענק
			</option>
		</select>
	)
}

export default MenuBarSelect
