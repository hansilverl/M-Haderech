import './MenuBarButton.css'

const MenuBarButton = (props) => {
	const { isActiveArg, content, editorFunc, editorFuncArg, editor } = props
	let { className } = props
	if (!className) className = 'syntax-button'
	return (
		<button
			onClick={() => editor.chain().focus()[editorFunc](editorFuncArg).run()}
			disabled={!editor.can().chain().focus()[editorFunc](editorFuncArg).run()}
			className={`${className} ${editor.isActive(isActiveArg) ? 'is-active' : ''}`}>
			{content}
		</button>
	)
}

export default MenuBarButton
