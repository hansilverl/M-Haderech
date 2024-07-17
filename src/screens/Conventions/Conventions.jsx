import './Conventions.css';

import React from 'react'
import PostsPresentor from '../../components/PostsPresentor/PostsPresentor'

const Conventions = () => {
	return (
		<div className='conventions-posts-screen'>
			<h1>כנסים</h1>
			<PostsPresentor
				type={'convention'}
				published={true}
				rowsAmount={4}
				allowPages={true}
				allowSearch={true}
			/>
		</div>
	)
}

export default Conventions
