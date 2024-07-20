import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './SingleBusiness.css';
import Controls from './Controls';

const SingleBusiness = () => {
  const [businessData, setBusinessData] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingActivate, setloadingActivate] = useState(false);
  const [loadingDeactivate, setloadingDeactivate] = useState(false);
  const [loadingDelete, setloadingDelete] = useState(false);
  const [chatCount, setchatCount] = useState(null)
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://sahajapi.vercel.app/merchant/api/businesses/${id}`);
      setBusinessData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching business data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);
  const navigation = useNavigate();

  const handleAction = async (action) => {
    try {
      if (action === 'activate') {
        await handleActivate(id);
      } else if (action === 'deactivate') {
        await handleDeactivate(id);
      } else if (action === 'delete') {
        await handleDelete(id);
      }
    } catch (error) {
      console.error(`Error on ${action}`, error);
    }
  };

  if (!businessData) {
    return <div style={{ textAlign: 'center', marginTop: 100 }}>{loading ? <i className="fa fa-spinner fa-spin"></i> : ''} Loading...</div>;
  }

  const displayFullscreenImage = (image) => {
    setFullscreenImage(image);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this account?');
    if (!confirmDelete) return; // If user cancels, do nothing
    setloadingDelete(true);
    try {
      await axios.delete(`https://sahajapi.vercel.app/merchant/API/businesses/${id}`);
      console.log('Delete merchant with id:', id);
      setloadingDelete(false);

      navigation('/');
    } catch (error) {
      console.error('Error deleting merchant:', error);
      setloadingDelete(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      setloadingActivate(true);
      await axios.put(`https://sahajapi.vercel.app/merchant/verify/${id}`);
      console.log('Activate merchant with id:', id);
      setloadingActivate(false);
      fetchData();
    } catch (error) {
      console.error('Error activating merchant:', error);
      setloadingActivate(false);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      setloadingDeactivate(true);
      await axios.put(`https://sahajapi.vercel.app/merchant/unverify/${id}`);
      console.log('Deactivate merchant with id:', id);
      setloadingDeactivate(false);
      fetchData();
    } catch (error) {
      setloadingDeactivate(false);
      console.error('Error Deactivating merchant:', error);
    }
  };
  return (
    <div className="admin-single-business-container">
      <Link to="/" className="back-icon">
        &#8592;
      </Link>
      <h1>Business Name : {businessData.businessName}</h1>
      <Controls id={id} />
      <div class="business-info">
        <p>
          <i class="fa fa-map-marker"></i> Pincode: {businessData.pincode}
        </p>
        <p>
          <i class="fa fa-map"></i> Area: {businessData.area}
        </p>
        <p>
          <i class="fa fa-city"></i> City: {businessData.city.trim()}
        </p>
        <p>
          <i class="fa fa-flag"></i> State: {businessData.state.trim()}
        </p>
        <p>
          <i class="fa fa-phone"></i> Phone Number: {businessData.phoneNumber}
        </p>
        <p>
          <i class="fa fa-envelope"></i> Email: {businessData.email}
        </p>
        <p>
          <i class="fa fa-info-circle"></i> Description: {businessData.description}
        </p>
        <p>
          <i class="fa fa-check-circle"></i> Verified: {businessData.isVerified ? 'Yes' : 'No'}
        </p>
        <p>
          <i class="fa fa-clock"></i> Opening Hours: {businessData.openingHour}
        </p>
        <p>
          <i class="fa fa-clock"></i> Closing Hours: {businessData.closingHour}
        </p>
      </div>

      <div className="business-actions">
        <button className="activate" disabled={businessData.isVerified === true} onClick={() => handleAction('activate')}>
          {loadingActivate ? <i className="fa fa-spinner fa-spin"></i> : ''}
          {businessData.isVerified === true ? ' Activated' : ' Activate'}{' '}
          {businessData.isVerified === true ? <i className="fa fa-check-circle"></i> : ''}
        </button>
        {businessData.isVerified === true ? (
          <button className="deactivate" onClick={() => handleAction('deactivate')}>
            {loadingDeactivate ? <i className="fa fa-spinner fa-spin"></i> : ''}
            {` Deactivate`} <i className="fa fa-times-circle"></i>
            {loading ? <i className="fa fa-spinner fa-spin"></i> : ''}
          </button>
        ) : (
          ''
        )}
        <button className="delete" onClick={() => handleAction('delete')}>
          {loadingDelete ? <i className="fa fa-spinner fa-spin"></i> : ''}
          {` Delete Account`} <i className="fa fa-trash"></i>
        </button>
      </div>

      <h2>Documents</h2>
      <div className="business-images">
        {businessData.imagesWithDescriptions.map(({ image, description, _id }) => (
          <div key={_id} className="image-with-description">
            <p style={{ fontSize: 18, fontWeight: 'bold', textDecoration: 'underline' }}>{String(description).toUpperCase()}</p>

            <img
              src={`https://sahajghar-img-backend.vercel.app/images/${image}`}
              alt={image}
              onClick={() => displayFullscreenImage(image)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  displayFullscreenImage(image);
                }
              }}
              tabIndex="0" // Ensure the image is focusable
            />
          </div>
        ))}
      </div>

      {fullscreenImage && (
        <div className="fullscreen" onClick={() => setFullscreenImage(null)}>
          <img src={`https://sahajghar-img-backend.vercel.app/images/${fullscreenImage}`} alt="Fullscreen view" />
          <button
            className="close-icon"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenImage(null);
            }}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default SingleBusiness;
