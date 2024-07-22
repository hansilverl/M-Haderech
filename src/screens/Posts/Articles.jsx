import './Articles.css'

import React from 'react'
import PostsPresentor from '../../components/PostsPresentor/PostsPresentor'

const Articles = () => {
	return (
		<div className='general-container'>
			<div className='articles-posts-screen'>
				<h1>בלוג</h1>
				<PostsPresentor
					type={'post'}
					published={true}
					allowPages={true}
					allowSearch={true}
					maxRows={4}
				/>
			</div>
		</div>
	)
}

export default Articles
