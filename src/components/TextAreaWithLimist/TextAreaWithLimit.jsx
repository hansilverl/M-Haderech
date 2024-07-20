import './TextAreaWithLimit.css'

import React from 'react'

const TextAreaWithLimit = (props) => {
	const { limit, value, setValue, rows } = props

	const handleChange = (event) => {
		if (event.target.value.length > limit) return
		setValue(event.target.value ? event.target.value : '')
	}

	return (
		<div className={`text-area-with-limit-container`}>
			<textarea
				className='text-area-with-limit'
				rows={rows}
				value={value}
				onChange={handleChange}
				maxLength={limit}
			/>
			<div className='char-count'>
				{value.length}/{limit}
			</div>
		</div>
	)
}

export default TextAreaWithLimit
