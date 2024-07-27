import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css'; // Import your CSS file
import { useParams, Link, useNavigate } from 'react-router-dom';
const ProductsListed = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://sahajapi.vercel.app/products/business-products/${id}`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  const navigate = useNavigate()
  if (loading) {
    return ( 
     <div style={{width:"100%",height:"85vh",display:"flex",
     justifyContent:"center",alignItems:"center"}}>
        <i style={{fontSize:30,color:"#676"}} className="fa fa-spinner fa-spin"></i>
     </div>
    )
    ;
  }

  return (
    <>
          <h2 style={{textAlign:"left",}}>Products</h2>

  

    <div className="products-list">
      
      {products.map((product) => (
        <div onClick={()=>{
            navigate(`/product/${product._id}`)
        }} className="product-card" key={product._id}>
          <img  className='product-card-img' src={`https://api.sahajnirman.com/images/${product.imagesWithDescriptions[0].image}`} alt={product.imagesWithDescriptions[0].description} />
          <div className="product-details">
            <h2>{product.ProductName}</h2>
            <hr/>
            <p>{product && String(product.productDesciption).length >50 ? product.productDesciption + "..." :  product.productDesciption}</p>
            
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default ProductsListed;
