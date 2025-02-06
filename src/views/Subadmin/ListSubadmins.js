// ListSubadmins.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListSubadmin.css'
const ListSubadmins = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    axios.get('https://sahajback.vercel.app/admin/getalladmins')
      .then(response => {
        console.log(response.data);
        setAdmins(response.data);
      })
      .catch(error => console.error('Error fetching admins:', error));
  }, []);

  return (
    <div>
      {admins.map(admin => (
        <div key={admin._id} className="admin-card">
          <img src="https://cdn3d.iconscout.com/3d/premium/thumb/top-rated-customer-service-5045245-4204251.png?f=webp" alt="Admin" className="admin-image" />
          <div className="admin-info">
            <p>Username: {admin.username}</p>
            <p>Password: {admin.password}</p>
             
            <p>Date: {new Date(admin.date).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListSubadmins;
