import './Conventions.css';

import React from 'react'
import PostsPresentor from '../../components/PostsPresentor/PostsPresentor'

const Conventions = () => {
	return (
		<div className='conventions-posts-screen'>
			<h1>אירועים</h1>
			<PostsPresentor
				type={'convention'}
				published={true}
				allowPages={true}
				allowSearch={true}
				maxRows={4}
			/>
		</div>
	)
}

export default Conventions
