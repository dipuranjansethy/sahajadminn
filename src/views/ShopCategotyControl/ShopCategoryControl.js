import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // Import the CSS file

const ShopCategoriesSelection = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    // Fetch the saved categories from the server when the component mounts
    console.log("Fetching categories from the server...");
    axios.get('https://sahajback.vercel.app/admin/shopoption')
      .then(response => {
        console.log("Response from server:", response.data); // Check the structure of the response
        // Adjust the path based on the actual response structure
        if (response.data.length > 0) {
          setSelectedCategories(response.data[0].categories || []);
        }
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleCategoryChange = (event) => {
    const { value } = event.target;

    // Check if the category is already selected
    if (selectedCategories.includes(value)) {
      setSelectedCategories(selectedCategories.filter(category => category !== value));
    } else {
      setSelectedCategories([...selectedCategories, value]);
    }
  };

  const handleSaveToDatabase = () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category before saving.');
      return;
    }

    console.log("Saving categories to the server:", selectedCategories);
    axios.post('https://sahajback.vercel.app/admin/shopoption', {
      categories: selectedCategories
    })
    .then(response => {
      console.log('Categories saved successfully:', response.data);
      alert('Session updated successfully');
    })
    .catch(error => {
      console.error('Error saving categories:', error);
      alert('Failed to save categories. Please try again.');
    });
  };

  const categories = [
    'Construction Services',
   'Interior Design',
'Exterior Landscaping',
'Architectural Planning' ,
'Home Renovation',
'Painting Services',
'Roofing Services' ,
'Plumbing Services',
'Electrical Services',
'Flooring Services',
'Security System Installation',
'Window and Door Installation',
];

  return (
    <div className="categories-container">
      <h2>Select Categories:</h2>
      <form>
        {categories.map(category => (
          <div key={category} className="category-item">
            <input
              type="checkbox"
              id={category}
              name="categories"
              value={category}
              checked={selectedCategories.includes(category)}
              onChange={handleCategoryChange}
            />
            <label htmlFor={category}>{category}</label>
          </div>
        ))}
      </form>
      <button type="button" onClick={handleSaveToDatabase}>Change Session</button>
      <p className="selected-categories">Selected Categories: {selectedCategories.join(', ')}</p>
    </div>
  );
};

export default ShopCategoriesSelection;
