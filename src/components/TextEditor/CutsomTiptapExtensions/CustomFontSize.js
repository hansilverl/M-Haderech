import { Extension } from '@tiptap/core'
import TextStyle from '@tiptap/extension-text-style'

const CustomFontSize = TextStyle.extend({
	name: 'customTextStyle',
	
	addGlobalAttributes() {
		return [
			{
				types: ['textStyle', 'listItem', 'heading', 'paragraph', 'orderedList', 'bulletList'],
				attributes: {
					fontSize: {
						default: null,
						renderHTML: (attributes) => {
							if (!attributes.fontSize) {
								return {}
							}
							return { style: `font-size: ${attributes.fontSize}px` }
						},
						parseHTML: (element) => ({
							fontSize: element.style.fontSize.replace('px', ''),
						}),
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