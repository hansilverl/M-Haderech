import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './AdminDashboard.css';
import Dashboard from './Dashboard';
import Posts from './Posts';
import Users from './Users';
import Sidebar from '../../components/AdminDashboard/Sidebar';
import Statistics from './Statistics';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard" dir="rtl">
      <Sidebar />
      <div className="content" dir="rtl">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="posts" element={<Posts />} />
          <Route path="users" element={<Users />} />
          <Route path="statistics" element={<Statistics />} />

        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
