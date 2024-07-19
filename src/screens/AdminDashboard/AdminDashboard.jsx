// src/screens/AdminDashboard/AdminDashboard.jsx
import './AdminDashboard.css'

import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import AdminContentManagement from './AdminContentManagement'
import Users from './Users'
import Sidebar from '../../components/AdminDashboard/Sidebar'
import QuestionnaireManagement from './QuestionnaireManagement'
import Miscellaneous from './Miscellaneous'
import AdminUserHistory from './AdminUserHistory'
import AdminExplanation from './AdminExplanation'
import PostEditPageContainer from '../PostEditpage/PostEditpage'

const AdminDashboard = () => {
	const location = useLocation()
	const showExplanation = location.pathname === '/admin'

	return (
		<div className='admin-dashboard'>
			<div className='admin-dashboard-content'>
				{showExplanation && (
					<div className='admin-explanation-container'>
						<AdminExplanation />
					</div>
				)}
				<Routes>
					<Route exact path='posts' element={<AdminContentManagement />} />
					<Route exact path='users' element={<Users />} />
					<Route exact path='questionnaire' element={<QuestionnaireManagement />} />
					<Route exact path='miscellaneous' element={<Miscellaneous />} />
					<Route exact path='history' element={<AdminUserHistory />} />
					<Route exact path='edit/:id' element={<PostEditPageContainer />} />
				</Routes>
			</div>
			<Sidebar />
		</div>
	)
}

export default AdminDashboard
