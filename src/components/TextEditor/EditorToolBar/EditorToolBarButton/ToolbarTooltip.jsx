import './ToolBarButton.css'

import React, { useState , useRef} from 'react'
const ToolbarTooltip = (props) => {
	const { text, children } = props
	const [visible, setVisible] = useState(false)
	const [position, setPosition] = useState({ x: 0, y: 0 })
	const timeoutRef = useRef(null)

	const showTooltip = (e) => {
		if (timeoutRef.current || visible) {
			return
		}

		timeoutRef.current = setTimeout(() => {
			setVisible(true)
			clearTimeout(timeoutRef.current)
			timeoutRef.current = null
		}, 500)
	}

	const hideTooltip = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
			timeoutRef.current = null
		}
		setVisible(false)
	}

	const handleMouseMove = (e) => {
		setPosition({ x: e.clientX, y: e.clientY })
	}

	return (
		
		<div
			className='toolbar-button-tooltip-container '
			onMouseEnter={showTooltip}
			onMouseLeave={hideTooltip}
			onMouseMove={handleMouseMove}>
			{children}
			{!visible || !text ? null : (
				<div className='tooltip-text' style={{ top: position.y + 10, left: position.x + 10 }}>
					{text}
				</div>
			)}
		</div>
	)
}

export default ToolbarTooltip
