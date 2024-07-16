import './AdminContentManagement.css'

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import usePostCreate from '../../hooks/usePostCreate'
import PostsPresentor from '../../components/PostsPresentor/PostsPresentor'

const MAX_PER_PAGE = 6

const AdminContentManagement = () => {
	const [isCreateButtonDisabled, setCreateButtonDisabled] = useState(false)
	const [type, setType] = useState('post')
	const [typeName, setTypeName] = useState('מאמר')
	const { postCreateID, startCreate } = usePostCreate()
	const navigate = useNavigate()

	const addPostHandler = async (e) => {
		setCreateButtonDisabled(true)
		startCreate(type)
	}

	useEffect(() => {
		if (postCreateID) {
			navigate(`/edit/${postCreateID}`)
		}
	}, [postCreateID, navigate])

	useEffect(() => {
		if (type === 'post') {
			setTypeName('מאמר')
		} else if (type === 'convention') {
			setTypeName('כנס')
		}
	}, [type])

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
			<div className='add-post-button-container'>
				<button
					className='add-post-button'
					onClick={addPostHandler}
					disabled={isCreateButtonDisabled}>
					{`הוספת ${typeName}`}
				</button>
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
		</div>
	)
}

export default AdminContentManagement
