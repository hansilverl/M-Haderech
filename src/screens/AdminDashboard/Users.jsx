import React, { useState, useEffect } from 'react';
import './Users.css';
import { FaKey } from 'react-icons/fa';
import { db, auth } from '../../firebase/config'; 
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleResetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert(`אימייל לאיפוס סיסמה נשלח אליך.`);
    } catch (error) {
      console.error('Error sending password reset email: ', error);
      alert(`אירעה שגיאה בשליחת האימייל: ${error.message}`);
    }
  };

  const handleToggleAdmin = async (id, isAdmin) => {
    try {
      const userDoc = doc(db, 'users', id);
      await updateDoc(userDoc, { isAdmin: !isAdmin });
      setUsers(users.map(user => user.id === id ? { ...user, isAdmin: !isAdmin } : user));
    } catch (error) {
      console.error('Error updating admin status: ', error);
      alert(`שגיאה בעדכון סטטוס ניהול: ${error.message}`);
    }
  };

  const filteredUsers = users.filter(user => user.email.toLowerCase().startsWith(searchTerm.toLowerCase()));

  return (
    <div className='users'>
      <h1>משתמשות</h1>
      <p>מספר משתמשות רשומות: {users.length}</p> {/* Display the number of registered users */}
      <input
        type="text"
        placeholder="חיפוש משתמשת לפי אימייל"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='search-input'
      />
      <table className='users-table'>
        <thead>
          <tr>
            <th>אימייל</th>
            <th>מנהלת</th>
            <th>איפוס סיסמא</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <input
                  type="checkbox"
                  checked={user.isAdmin || false}
                  onChange={() => handleToggleAdmin(user.id, user.isAdmin)}
                />
              </td>
              <td>
                <button title="איפוס סיסמה" onClick={() => handleResetPassword(user.email)}><FaKey style={{ color: 'black' }} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
