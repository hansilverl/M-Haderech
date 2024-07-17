import './Articles.css'

import React from 'react'
import PostsPresentor from '../../components/PostsPresentor/PostsPresentor'

const Articles = () => {
	return (
		<div className='articles-posts-screen'>
			<h1>מאמרים</h1>
			<PostsPresentor
				type={'post'}
				published={true}
				allowPages={true}
				allowSearch={true}
				maxRows={4}
			/>
		</div>
	)
}

export default Articles
