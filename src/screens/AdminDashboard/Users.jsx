// src/screens/AdminDashboard/Users.jsx
import React, { useState, useEffect } from 'react';
import './Users.css';
import { FaEdit, FaTrashAlt, FaKey, FaPlus } from 'react-icons/fa';
import { db, auth } from '../../firebase/config'; 
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useSignup } from '../../hooks/useSignup';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const { signup, error } = useSignup();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleEdit = (id) => {
    alert(`ערוך משתמש ${id}`);
  };

  const handleDelete = async (id, email) => {
    const confirmation = window.confirm(`האם אתה בטוח שברצונך למחוק את המשתמש ${email}?`);
    if (confirmation) {
      try {
        await deleteDoc(doc(db, 'users', id));
        setUsers(users.filter(user => user.id !== id));
        alert(`המשתמש ${id} נמחק בהצלחה`);
      } catch (error) {
        console.error('Error deleting user: ', error);
        alert(`שגיאה במחיקת המשתמש: ${error.message}`);
      }
    }
  };

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

  const handleAddUser = async () => {
    const email = prompt('הזן את האימייל של המשתמש החדש:');
    const password = prompt('הזן את הסיסמה של המשתמש החדש:');
    if (email && password) {
      try {
        await signup(email, password);
        setUsers([...users, { id: email, email, isAdmin: false }]);
        alert('המשתמש נוצר בהצלחה');
      } catch (error) {
        console.error('Error creating user: ', error);
        alert(`שגיאה ביצירת המשתמש: ${error.message}`);
      }
    } else {
      alert('נדרשים אימייל וסיסמה ליצירת משתמש חדש.');
    }
  };

  return (
    <div className='users'>
      <h1>משתמשים</h1>
      <button className='add-user-button' onClick={handleAddUser}>
        <FaPlus /> צור משתמש חדש
      </button>
      {error && <div className='error'>{error}</div>}
      <table className='users-table'>
        <thead>
          <tr>
            <th>אימייל</th>
            <th>מנהל</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
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
                <button onClick={() => handleEdit(user.id)}><FaEdit style={{ color: 'black' }} /></button>
                <button onClick={() => handleDelete(user.id, user.email)}><FaTrashAlt style={{ color: 'black' }} /></button>
                <button onClick={() => handleResetPassword(user.email)}><FaKey style={{ color: 'black' }} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
