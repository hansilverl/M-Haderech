// src/screens/AdminDashboard/AdminDashboard.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './AdminDashboard.css';
import Posts from './Posts';
import Users from './Users';
import Sidebar from '../../components/AdminDashboard/Sidebar';
import QuestionnaireManagement from './QuestionnaireManagement';
import Miscellaneous from './Miscellaneous';
import AdminUserHistory from './AdminUserHistory';
import AdminExplanation from './AdminExplanation';

const AdminDashboard = () => {
  const location = useLocation();
  const showExplanation = location.pathname === '/admin';

  return (
    <div className="admin-dashboard" dir="rtl">
      <Sidebar />
      <div className="content" dir="rtl">
        {showExplanation && (
          <div className="admin-explanation-container">
            <AdminExplanation />
          </div>
        )}
        <Routes>
          <Route exact path="posts" element={<Posts />} />
          <Route exact path="users" element={<Users />} />
          <Route exact path="questionnaire" element={<QuestionnaireManagement />} />
          <Route exact path="miscellaneous" element={<Miscellaneous />} />
          <Route exact path="history" element={<AdminUserHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
