import React, { useEffect } from 'react'

import './Selector.css'

const Selector = (props) => {
	const { id, selectFunction, optionValues, optionNames, currentValue, name, disabled } = props
	const currentValueIndex = optionValues.indexOf(currentValue)

	useEffect(() => {
		if (currentValueIndex < 0) selectFunction(optionValues[0])
		
	}, [currentValueIndex])

	return (
		<div className='main-flex-row selector'>
			<label htmlFor='post-type' className='input-label'>
				{name}:
			</label>
			<select
				id={id}
				value={currentValue}
				onChange={(e) => selectFunction(e.target.value)}
				className='post-type-select'
				disabled={disabled}>
				{optionValues.map((optionValue, index) => (
					<option key={index} value={optionValue}>
						{optionNames[index]}
					</option>
				))}
			</select>
		</div>
	)
}

export default Selector