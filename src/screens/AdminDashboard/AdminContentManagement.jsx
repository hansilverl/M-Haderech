import './AdminContentManagement.css'

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import usePostCreate from '../../hooks/usePostCreate'
import PostsPresentor from '../../components/PostsPresentor/PostsPresentor'

const MAX_PER_PAGE = 12

const AdminContentManagement = () => {
	const [isCreateButtonDisabled, setCreateButtonDisabled] = useState(false)
	const [type, setType] = useState('post')
	const { postCreateID, startCreate } = usePostCreate()
	const navigate = useNavigate()

	const addPostHandler = async (e) => {
		setCreateButtonDisabled(true)
		startCreate()
	}

	useEffect(() => {
		if (postCreateID) {
			navigate(`/edit/${postCreateID}`)
		}
	}, [postCreateID, navigate])

	// Sort posts such that 'post' type comes before 'convention' type
	return (
		<div className='admin-dashboard-posts-container'>
			<div className='admin-dashboard-posts-navbar-container'>
				<ul className='admin-dashboard-posts-navbar-menu'>
					<li className={type === 'post' ? 'active-tab' : ''}>
						<button onClick={() => setType('post')}>מאמרים</button>
					</li>
					<li className={type === 'convention' ? 'active-tab' : ''}>
						<button onClick={() => setType('convention')}>כנסים</button>
					</li>
				</ul>
			</div>
			<PostsPresentor
				key={type}
				type={type}
				published={false}
				pageSize={MAX_PER_PAGE}
				allowAdmin={true}
				allowPages={true}
				allowSearch={true}
			/>
			<button
				className='add-post-button'
				onClick={addPostHandler}
				disabled={isCreateButtonDisabled}>
				הוספת מאמר
			</button>
		</div>
	)
}

export default AdminContentManagement
