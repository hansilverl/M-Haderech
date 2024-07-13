import './MenuBarSelect.css'
import Select from 'react-select'

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

const MenuBarSelectSize = (props) => {
	const { editor } = props

	const options = []
	for (let i = 12; i <= 50; i += 2) {
		options.push({ value: i, label: `${i}px` })
	}

	if (!editor) return null

	const setFontSize = (size) => {
		if(!size) return
		editor.chain().focus().setFontSize(size).run()
	}

	const unsetFontSize = () => {
		editor.chain().focus().unsetFontSize().run()
	}

	const getFontSize = () => {
		const attrs = editor.getAttributes('textStyle')
		return attrs.fontSize
	}

	const handleChange = (newValue, actionMeta) => {
		setFontSize(newValue?.value)
	}

	const handleInputChange = (inputValue, actionMeta) => {
		console.group('Input Changed')
		console.log(inputValue)
		console.log(`action: ${actionMeta.action}`)
		console.groupEnd()
	}

	return (
		<div className='menu-bar-select-container'>
			<label>גודל גופן:</label>
			<Select
				options={options}
				value={getFontSize() || 'גודל גופן'}
				onChange={handleChange}
				onInputChange={handleInputChange}
				isClearable={true}
				isSearchable={true}
				isDisabled={false}
				placeholder='בחר גודל גופן'

			/>
		</div>
	)
}

export default MenuBarSelectSize
