import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaProductHunt, FaTasks } from 'react-icons/fa';

const Controls = ({id}) => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product-list/${productId}`);
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/service-list/${serviceId}`);
  };

  return (
    <div>
      <button onClick={() => handleProductClick(id)} style={buttonStyle}>
        <FaProductHunt className="icon" /> View all Product
      </button>
      <button onClick={() => handleServiceClick(id)} style={buttonStyle}>
        <FaTasks className="icon" /> View all Service
      </button>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: 'violet',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  margin: '5px',
  backgroundImage: 'linear-gradient(to right, violet, indigo)', // Linear gradient background
};

export default Controls;
