import React from 'react';
import './AdminExplanation.css';
import pdfIcon from '../../assets/pdf-file.png'; // Importing the PDF icon

const AdminExplanation = () => {
  return (
    <div className="admin-explanation" dir="rtl">
      {/* PDF Icon with title under it */}
      <div className="pdf-container-explain">
        <a href={require('../../assets/Site guide.pdf')} target="_blank" rel="noopener noreferrer">
          <img src={pdfIcon} alt="PDF Icon" className="pdf-icon-explain" />
        </a>
        <span className="pdf-title-explain">
          <a href={require('../../assets/Site guide.pdf')} target="_blank" rel="noopener noreferrer" className="pdf-link-explain">
          מעבר למדריך המפורט
          </a>
          </span>
      </div>
      
      <h1 className="welcome-header">ברוכות הבאות ללוח הניהול</h1>
      <p className="intro-text">כאן תוכלו לנהל את האתר ולבצע פעולות שונות בהתאם לקטגוריות המפורטות:</p>
      <ul className="category-list">
        <li className="category-item"><strong>ניהול תוכן:</strong> ניהול המאמרים והאירועים של האתר, כולל יצירה, עריכה ומחיקה של מאמרים ואירועים.</li>
        <li className="category-item"><strong>משתמשות:</strong> ניהול המשתמשות הרשמות באתר, כולל הגדרת הרשאות, ואיפוס סיסמאות.</li>
        <li className="category-item"><strong>ניהול מבדקים:</strong> ניהול המבדקים, כולל הוספה, עריכה ומחיקה של שאלות ותשובות.</li>
        <li className="category-item"><strong>היסטוריית מבדקים:</strong> צפייה בהיסטוריית מבדקים ומעקב אחר תשובות המשתמשות.</li>
        <li className="category-item"><strong>שונות:</strong> מידע כללי וסטטיסטיקות שונות כגון פרטי בנק, אודות יצירת קשר ועוד.</li>
      </ul>
    </div>
  );
};

export default AdminExplanation;
