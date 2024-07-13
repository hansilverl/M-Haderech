import './ToolBarButton.css'

const ToolBarButton = (props) => {
	const { isActiveArg, content, editorFunc, editorFuncArgs, editor, className } = props
	const activeClass = editor.isActive(isActiveArg) ? 'is-active' : ''

	const clickHandler = () => {
		if (typeof editorFunc === 'string') {
			editor.chain().focus()[editorFunc](editorFuncArgs).run()
			return
		}

		let tempEditor = editor.chain().focus()
		editorFunc.forEach((func, index) => {
			tempEditor = tempEditor[func](editorFuncArgs[index])
		})
		tempEditor.run()
	}

	const isDisabled = () => {
		if (typeof editorFunc === 'string') {
			return !editor.can().chain().focus()[editorFunc](editorFuncArgs).run()
		}

		let tempEditor = editor.can().chain().focus()
		editorFunc.forEach((func, index) => {
			tempEditor = tempEditor[func](editorFuncArgs[index])
		})
		return !tempEditor
	}

	return (
		<button
			onClick={clickHandler}
			disabled={isDisabled}
			className={`text-editor-menu-bar-button ${className} ${activeClass}`}>
			{content}
		</button>
	)
}

export default ToolBarButton
