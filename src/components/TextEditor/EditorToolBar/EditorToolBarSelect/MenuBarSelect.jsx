import './MenuBarSelect.css'
import Select from 'react-select'

const MenuBarSelectSize = (props) => {
	const { editor } = props

	const options = []
	for (let i = 12; i <= 60; i += 2) {
		options.push({ value: `${i}px`, label: `${i}px` })
	}

	if (!editor) return null

	const setFontSize = (size) => {
		if (!size) return
		editor.chain().focus().setFontSize(size).run()
	}

	const getFontSize = () => {
		const attrs = editor.getAttributes('textStyle')
		return attrs.fontSize
	}

	const handleChange = (newValue, actionMeta) => {
		setFontSize(newValue?.value)
	}

	const handleInputChange = (inputValue, actionMeta) => {}

	const getPlaceHolder = () => {
		const fontSize = getFontSize()

		if (!fontSize) return 'בחירה'
		return `גודל גופן: ${fontSize}`
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
				placeholder={getPlaceHolder()}
			/>
		</div>
	)
}

export default MenuBarSelectSize
