import React from 'react';

import './PostTypeSelector.css';

const PostTypeSelector = (props) => {
	const { selectFunction } = props;

	return (
		<div id='post-type-selector' className='flex-row'>
			<label htmlFor='post-type' className='input-label'>סוג הפוסט:</label>
			<select name='סוג הפוסט' id='post-type' onChange={selectFunction} className='post-type-select'>
				<option value=''>בחר</option>
				<option value='editor'>עריכה</option>
				<option value='file'>קובץ</option>
			</select>
		</div>
	);
};

export default PostTypeSelector;
