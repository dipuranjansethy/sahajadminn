import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPlus } from '@fortawesome/free-solid-svg-icons';
import './CreateSubAdmin.css'
import {useNavigate } from 'react-router-dom'
const CreateSubAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [merchantPermission, setMerchantPermission] = useState('');
  const [userPermission, setUserPermission] = useState('');
  const navigation = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const permissions = {
        merchantRead: merchantPermission === 'view',
        merchantEdit: merchantPermission === 'edit',
        merchantAllAccess: merchantPermission === 'all',
        userRead: userPermission === 'view',
      };

      const response = await axios.post('https://sahajback.vercel.app/admin/create-admin', { username, password, permissions });
      if(response.data.success === true){
        navigation('/subadmin-list')
      }
      // Reset form or show success message
    } catch (error) {
      console.error(error);
      // Handle error, show error message
    }
  };

  const handlePermissionChange = (e, setter) => {
    setter(e.target.value);
  };

  return (
    <div className="create-subadmin-container">
      <button onClick={()=>{
        navigation('/subadmin-list')
      }} className="list-subadmins-btn">
        <FontAwesomeIcon icon={faList} /> List of Subadmins
      </button>
      <form onSubmit={handleSubmit} className="subadmin-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="permissions">
          <div className="permission-section">
            <label>Merchant Permission:</label>
            <div className="toggle-options">
              <label>
                <input type="radio" name="merchantPermission" value="view" checked={merchantPermission === 'view'} onChange={(e) => handlePermissionChange(e, setMerchantPermission)} />
                View
              </label>
              <label>
                <input type="radio" name="merchantPermission" value="edit" checked={merchantPermission === 'edit'} onChange={(e) => handlePermissionChange(e, setMerchantPermission)} />
                Edit
              </label>
              <label>
                <input type="radio" name="merchantPermission" value="all" checked={merchantPermission === 'all'} onChange={(e) => handlePermissionChange(e, setMerchantPermission)} />
                All Access
              </label>
            </div>
          </div>
          <div className="permission-section">
            <label>User Permission:</label>
            <div className="toggle-options">
              <label>
                <input type="radio" name="userPermission" value="view" checked={userPermission === 'view'} onChange={(e) => setUserPermission(e.target.value)} />
                View
              </label>
            </div>
          </div>
        </div>
        <button type="submit" className="create-btn">
          <FontAwesomeIcon icon={faPlus} /> Create
        </button>
      </form>
    </div>
  );
};

export default CreateSubAdmin;

