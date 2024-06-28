import React, { useState } from 'react'

import TextEditor from '../../components/TextEditor/TextEditor'
import PostTypeSelector from '../../components/PostTypeSelector/PostTypeSelector'

import './PostEditpage.css'

const PostEditpage = (props) => {
	const { postID } = props
	const [postType, setPostType] = useState('postType')

	const selectPostType = (e) => {
		const value = e.target.value
		if (!value) return
		setPostType(value)
		console.log(postType)
	}

	const checkPostID = (postID) => {
		switch (postID) {
			case 'editor':
				return <TextEditor />
			case 'file':
				return <h2>קובץ</h2>
			default:
				return (
					<>
						<div className='flex-row'>
							<PostTypeSelector selectFunction={selectPostType} />
						</div>
						<div id='post-contents' className='flex-col'>
							<h2>תוכן הפוסט:</h2>
							{postType === 'editor' && <TextEditor />}
							{postType === 'file' && <input type='file' />}
						</div>
					</>
				)
		}
	}

	return (
		<div id='edit-post-page' className='flex-col'>
			<div className='flex-row'>
				<h1>כותרת הפוסט:</h1>
				<input type='text' placeholder='כותרת' />
			</div>
			<div className='flex-row'>
				<h2>תיאור הפוסט:</h2>
				<input type='text' placeholder='תיאור' />
			</div>
			<div className='flex-row'>
				<h2>תמונה ראשית:</h2>
				<input type='file' />
			</div>
			{checkPostID(postID)}
		</div>
	)
}

export default PostEditpage
