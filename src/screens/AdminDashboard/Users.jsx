import React, { useState } from 'react';
import './Users.css';
import { FaEdit, FaTrashAlt, FaKey, FaPlus } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: ' משתמש 1', email: 'userone@example.com' },
    { id: 2, name: ' משתמש 2', email: 'usertwo@example.com' },
    { id: 3, name: ' משתמש 3', email: 'userthree@example.com' }
  ]);

  const handleEdit = (id) => {
    alert(`Edit user ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete user ${id}`);
  };

  const handleResetPassword = (id) => {
    alert(`Reset password for user ${id}`);
  };

  const handleAddUser = () => {
    alert('Add new user');
  };

  return (
    <div className='users'>
      <h1>משתמשים</h1>
      <button className='add-user-button' onClick={handleAddUser}>
        <FaPlus /> צור משתמש חדש
      </button>
      <table className='users-table'>
        <thead>
          <tr>
            <th>שם</th>
            <th>אימייל</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
              <button onClick={() => handleEdit(user.id)}><FaEdit style={{ color: 'black' }} /></button>
                <button onClick={() => handleDelete(user.id)}><FaTrashAlt style={{ color: 'black' }} /></button>
                <button onClick={() => handleResetPassword(user.id)}><FaKey style={{ color: 'black' }} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
