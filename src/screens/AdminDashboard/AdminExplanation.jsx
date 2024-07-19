import React from 'react';
import './AdminExplanation.css';

const AdminExplanation = () => {
  return (
    <div className="admin-explanation" dir="rtl">
      <h1 className="welcome-header">ברוכות הבאות ללוח הניהול</h1>
      <p className="intro-text">כאן תוכלו לנהל את האתר ולבצע פעולות שונות בהתאם לקטגוריות המפורטות:</p>
      <ul className="category-list">
        <li className="category-item"><strong>מאמרים:</strong> ניהול המאמרים של האתר, כולל יצירה, עריכה ומחיקה של מאמרים.</li>
        <li className="category-item"><strong>משתמשים:</strong> ניהול המשתמשים הרשומים באתר, כולל הגדרת הרשאות, איפוס סיסמאות ומחיקה.</li>
        <li className="category-item"><strong>ניהול שאלונים:</strong> ניהול השאלונים, כולל הוספה, עריכה ומחיקה של שאלות ותשובות.</li>
        <li className="category-item"><strong>שונות:</strong> מידע כללי וסטטיסטיקות שונות כגון פרטי בנק, אודות ויצירת קשר.</li>
        <li className="category-item"><strong>היסטוריית משתמשים:</strong> צפייה בהיסטוריית שאלונים ומעקב אחר תשובות המשתמשים.</li>
      </ul>
    </div>
  );
};

export default AdminExplanation;
