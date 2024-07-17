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
				pageSize={20}
				allowPages={true}
				allowSearch={true}
			/>
		</div>
	)
}

export default Articles
