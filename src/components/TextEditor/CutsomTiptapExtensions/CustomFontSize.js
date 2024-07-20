import TextStyle from '@tiptap/extension-text-style'

const CustomFontSize = TextStyle.extend({
	name: 'customTextStyle',

	addGlobalAttributes() {
		return [
			{
				types: ['textStyle', 'listItem', 'heading', 'orderedList', 'bulletList'],
				attributes: {
					fontSize: {
						default: null,
						renderHTML: (attributes) => {
							if (!attributes.fontSize) {
								return {}
							}
							return { style: `font-size: ${attributes.fontSize}` }
						},
						parseHTML: (element) => {
							return element.style.fontSize.replace(/['"]+/g, '')
						},
					},
				},
			},
		]
	},

	addCommands() {
		return {
			setFontSize:
				(fontSize) =>
				({ chain }) => {
					return chain().setMark('textStyle', { fontSize }).run()
				},
			unsetFontSize:
				() =>
				({ chain }) => {
					return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
				},
		}
	},
})

export default CustomFontSize
