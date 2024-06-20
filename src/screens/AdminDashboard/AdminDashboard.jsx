// src/screens/AdminDashboard/AdminDashboard.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './AdminDashboard.css';
import Dashboard from './Dashboard';
import Posts from './Posts';
import Users from './Users';
import Sidebar from '../../components/AdminDashboard/Sidebar';
import Statistics from './Statistics';
import QuestionnaireManagement from './QuestionnaireManagement';
import Miscellaneous  from './Miscellaneous';
import AdminUserHistory from './AdminUserHistory';

const AdminDashboard = () => {
  const questionnaireId = "help-score"; // Change this to your actual questionnaire ID

  return (
    <div className="admin-dashboard" dir="rtl">
      <Sidebar />
      <div className="content" dir="rtl">
        <Routes>
          <Route exact path="dashboard" element={<Dashboard />} />
          <Route exact path="posts" element={<Posts />} />
          <Route exact path="users" element={<Users />} />
          <Route exact path="statistics" element={<Statistics />} />
          <Route exact path="questionnaire" element={<QuestionnaireManagement questionnaireId={questionnaireId} />} />
          <Route exact path="miscellaneous" element={<Miscellaneous  />} />
          <Route exact path="history" element={<AdminUserHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
