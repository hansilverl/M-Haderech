// src/screens/AdminDashboard/AdminExplanation.jsx
import React from 'react';
import './AdminExplanation.css';

const AdminExplanation = () => {
  return (
    <div className="admin-explanation" dir="rtl">
      <h1 className="welcome-header">ברוכים הבאים ללוח המחוונים של המנהל</h1>
      <p className="intro-text">כאן תוכלו לנהל את האתר ולבצע פעולות שונות בהתאם לקטגוריות המפורטות:</p>
      <ul className="category-list">
        <li className="category-item"><strong>פוסטים:</strong> ניהול הפוסטים של האתר, כולל יצירה, עריכה ומחיקה של פוסטים.</li>
        <li className="category-item"><strong>משתמשים:</strong> ניהול המשתמשים הרשומים באתר, כולל הגדרת הרשאות, איפוס סיסמאות ומחיקה.</li>
        <li className="category-item"><strong>ניהול שאלונים:</strong> ניהול השאלונים, כולל הוספה, עריכה ומחיקה של שאלות ותשובות.</li>
        <li className="category-item"><strong>שונות:</strong> מידע כללי וסטטיסטיקות שונות כגון פרטי בנק, אודות ויצירת קשר.</li>
        <li className="category-item"><strong>היסטוריית משתמשים:</strong> צפייה בהיסטוריית שאלונים ומעקב אחר תשובות המשתמשים.</li>
      </ul>
    </div>
  );
};

export default AdminExplanation;