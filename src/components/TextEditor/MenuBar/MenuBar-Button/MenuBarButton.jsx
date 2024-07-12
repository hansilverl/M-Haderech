import './MenuBarButton.css'

const MenuBarButton = (props) => {
	const { isActiveArg, content, editorFunc, editorFuncArg, editor, className } = props
	const activeClass = editor.isActive(isActiveArg) ? 'is-active' : ''
	
	return (
		<button
			onClick={() => editor.chain().focus()[editorFunc](editorFuncArg).run()}
			disabled={!editor.can().chain().focus()[editorFunc](editorFuncArg).run()}
			className={`text-editor-menu-bar-button ${className} ${activeClass}`}>
			{content}
		</button>
	)
}

export default MenuBarButton
