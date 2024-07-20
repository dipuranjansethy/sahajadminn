import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';
import './SingleService.css';
import { useParams } from 'react-router-dom';
import Loader from 'views/Loader';

const SingleService = () => {
  const [product, setProduct] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://sahajapi.vercel.app/services/servicesbyid/${id}`);
       console.log(response);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleImageClick = (image) => {
    setFullscreenImage(image);
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
  };

  if (!product) {
    return <Loader />;
  }
  const deleteService = async (id) => {
    // Confirm before deleting
    const isConfirmed = window.confirm("Are you sure you want to delete this service?");
    
    if (!isConfirmed) {
      // User clicked 'Cancel', do not delete
      return;
    }
  
    // Proceed with deletion after confirmation
    try {
      const res = await axios.delete(`https://sahajapi.vercel.app/services/services/${id}`); // Ensure the URL is correct
      if (res.data.success === true) {
        window.history.back()
      } else {
        alert('Error while deleting service! Try later');
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert('Error while deleting service! Try later');
    }
  }
  return (
    <div className="single-product">
      {fullscreenImage && (
        <div className="fullscreen-image-overlay" onClick={handleCloseFullscreen}>
          <div className="fullscreen-image-container">
            <img src={`https://sahajghar-img-backend.vercel.app/images/${fullscreenImage}`} alt="Fullscreen" />
            <button className="close-fullscreen-button" onClick={handleCloseFullscreen}>
              <AiOutlineClose />
            </button>
          </div>
        </div>
      )}
      <div className="single-product-images">
        {product.imagesWithDescriptions.map((img, index) => (
          <img
            key={index}
            src={`https://sahajghar-img-backend.vercel.app/images/${img.image}`}
            alt={img.description}
            onClick={() => handleImageClick(img.image)}
          />
        ))}
      </div>
      <hr style={{width:"100%"}}/>
      <div className="single-product-details">
        <h1 style={{ textAlign: "left" }}>{product.ServicesName}</h1>
        <p style={{ textAlign: "left" }}> {product.ServicesDesciption}</p>
        <p style={{textAlign:"right"}}>Date of Creation : {product.date}</p>

        <div className="category-details">
          <h3>Category:</h3>
          <ul>
            {product.category.map((cat, index) => (
              <li key={index}>{cat}</li>
            ))}
          </ul>
        </div>
        <div className="subcategory-details">
          <h3>Subcategory:</h3>
          <ul>
            {product.subcategory.map((subcat, index) => (
              <li key={index}>{subcat}</li>
            ))}
          </ul>
        </div>
      </div>
      <button onClick={()=>{
        deleteService(id)
      }
      } className='single-product-delete'>
     Delete Service <i className='fa fa-trash icon'></i>
     </button>
      <div className="single-product-business-details">
        <p style={{ textDecoration: 'underline' }}>
          This product associated with{' '}
          <span style={{ fontWeight: 'bold', color: '#1b1b1b' }}>{product.business.businessName}</span>
        </p>
        <p>{product.business.email}</p>
      </div>
    </div>
  );
};

export default SingleService;
