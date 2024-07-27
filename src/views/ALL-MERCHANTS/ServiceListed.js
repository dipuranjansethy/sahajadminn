import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css'; // Import your CSS file
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loader from 'views/Loader';
const ProductsListed = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://sahajapi.vercel.app//services/business-services/${id}`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);
  const navigate = useNavigate();
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <h2 style={{ textAlign: 'left' }}>Services</h2>

      <div className="products-list">
        {products.map((product) => (
          <div
            onClick={() => {
              navigate(`/service/${product._id}`);
            }}
            className="product-card"
            key={product._id}
          >
            <img
              className="product-card-img"
              src={`https://api.sahajnirman.com/banner/images/${product.imagesWithDescriptions[0].image}`}
              alt={product.imagesWithDescriptions[0].description}
            />
            <div className="product-details">
              <h2>{product.ServicesName}</h2>
              <hr />
              <p>
                {product && String(product.ServicesDesciption).length > 50
                  ? product.ServicesDesciption + '...'
                  : product.ServicesDesciption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductsListed;