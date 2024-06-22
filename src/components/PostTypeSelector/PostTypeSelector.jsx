import React from 'react'

import './PostTypeSelector.css'

const PostTypeSelector = (porps) => {
	const { selectFunction } = porps

	return (
		<div id='post-type-selector' className='flex-row'>
			<h2>סוג הפוסט:</h2>
			<select name='סוג הפוסט' id='post-type' onChange={selectFunction}>
				<option value=''>בחר</option>
				<option value='editor'>עריכה</option>
				<option value='file'>קובץ</option>
			</select>
		</div>
	)
}

export default PostTypeSelector
