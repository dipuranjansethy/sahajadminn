import React, { useState, useEffect } from 'react';
import './AppBanner.css';
import axios from 'axios';
import Loader from 'views/Loader';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const AppBanner = () => {
  const [mainBanners, setMainBanners] = useState(Array(3).fill(null));
  const [adsBanners, setAdsBanners] = useState(Array(3).fill(null));
  const [loading, setloading] = useState(true);

  const handleImageUpload = (event, index, setter, isAdsBanner) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setter((prevBanners) => {
        const newBanners = [...prevBanners];
        newBanners[index] = reader.result;
        return newBanners;
      });
    };
    reader.readAsDataURL(file);
  };

  // useEffect(() => {
  //   const fetchBanners = async () => {
  //     try {
  //       const response = await axios.get('https://api.sahajnirman.com/banner/get-all-banners');
  //       const { homeBanners, adsBanners } = response.data;

  //       // Set home banners
  //       if (homeBanners.length !== 0 && adsBanners.length !== 0) {
  //         setMainBanners(homeBanners.map((imageName) => `https://api.sahajnirman.com/banner/images/${imageName}`));

  //         // Set ads banners
  //         setAdsBanners(adsBanners.map((imageName) => `https://api.sahajnirman.com/banner/images/${imageName}`));

  //         setloading(false);
  //       } else {
  //         setloading(false);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching banners:', error);
  //     }
  //   };

  //   fetchBanners();
  // }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('https://api.sahajnirman.com/banner/get-all-banners');
        const { homeBanners, adsBanners } = response.data;

        if (homeBanners.length !== 0 && adsBanners.lenth !== 0) {
          // Function to convert image URL to base64 data URL
          const urlToBase64 = async (url) => {
            const response = await axios.get(`https://api.sahajnirman.com/banner/images/${url}`, { responseType: 'blob' });
            const blob = response.data;
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve(reader.result);
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          };

          // Convert image URLs to base64 data URLs
          const homeBannersBase64 = await Promise.all(homeBanners.map(urlToBase64));
          const adsBannersBase64 = await Promise.all(adsBanners.map(urlToBase64));

          // Set home banners
          setMainBanners(homeBannersBase64);

          // Set ads banners
          setAdsBanners(adsBannersBase64);

          setloading(false);
        } else {
          setloading(false);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        setloading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleSessionClick = () => {
    const mainFormData = new FormData();
    const adsFormData = new FormData();

    console.log('THIS IS THE ENCODE', mainBanners);

    mainBanners.forEach((image, index) => {
      if (image !== null) {
        // Convert Data URL to Blob
        const blob = dataURItoBlob(image);
        // Append Blob to FormData with desired filename and content type
        mainFormData.append('photos', blob, `main_banner_${Date.now()}-${Math.floor()}.jpg`); 
          //   Math.random() * 1000
     
      }
    });

    adsBanners.forEach((image, index) => {
      if (image !== null) {
        // Convert Data URL to Blob
        const blob = dataURItoBlob(image);
        // Append Blob to FormData with desired filename and content type
        adsFormData.append('photos', blob, `ads_banner_${Date.now()}-${Math.floor()}.jpg`);
      }
    });

    // Perform upload for mainBanners
    axios
      .post('https://api.sahajnirman.com/banner/upload-banner-work', mainFormData)
      .then((mainResponse) => {
        console.log('Main banners uploaded successfully:', mainResponse.data);
        const mainBannerKeys = mainResponse.data.map((banner) => banner.key);
        // Request to save main banner keys
        axios
          .post('https://api.sahajnirman.com/banner/save-homeBanner-banners', { homeBanner: mainBannerKeys })
          .then((response) => {
            console.log('Main banners keys saved successfully:', response.data);
            toast.success('Home banners uploaded successfully');
            // Handle response if needed
          })
          .catch((error) => {
            console.error('Error saving main banner keys:', error);
            // Handle error if needed
          });
      })
      .catch((mainError) => {
        console.error('Error uploading main banners:', mainError);
        // Handle error if needed
      });

    // Perform upload for adsBanners
    axios
      .post('https://api.sahajnirman.com/banner/upload-banner-work', adsFormData)
      .then((adsResponse) => {
        console.log('Ads banners uploaded successfully:', adsResponse.data);
        const adsBannerKeys = adsResponse.data.map((banner) => banner.key);
        // Request to save ads banner keys
        axios
          .post('https://api.sahajnirman.com/banner/save-adsBanner-banners', { adsBanner: adsBannerKeys })
          .then((response) => {
            console.log('Ads banners keys saved successfully:', response.data);
            toast.success('Ads banners uploaded successfully');
          })
          .catch((error) => {
            console.error('Error saving ads banner keys:', error);
            // Handle error if needed
          });
      })
      .catch((adsError) => {
        console.error('Error uploading ads banners:', adsError);
        // Handle error if needed
      });
  };

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  return (
    <div className="app-banner-container">
      {loading === true ? (
        <Loader />
      ) : (
        <>
          <p style={{ textDecoration: 'underline' }}>Create sessions based on the events for Sahaj Apps.</p>
          <h2 style={{ color: '#1b1b1b', textAlign: 'left', width: '100%', marginLeft: '10%' }}>Home Banners</h2>

          <div className="main-banners">
            {mainBanners.map((banner, index) => (
              <div key={`main-${index}`} className="banner-box">
                {banner ? (
                  <div className="banner-container">
                    <img src={banner} alt={`Banner ${index + 1}`} className="banner-image" />
                    <label htmlFor={`main-upload-${index}`} className="upload-label-e">
                      <i className="fa fa-edit"></i>
                      <input
                        type="file"
                        id={`main-upload-${index}`}
                        accept="image/*"
                        onChange={(event) => handleImageUpload(event, index, setMainBanners)}
                      />
                    </label>
                  </div>
                ) : (
                  <label htmlFor={`main-upload-${index}`} className="upload-label">
                    <i style={{ fontSize: 100, color: '#ccc' }} className="fa fa-plus" />
                    <input
                      type="file"
                      id={`main-upload-${index}`}
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event, index, setMainBanners)}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
          <h2 style={{ color: '#1b1b1b', textAlign: 'left', width: '100%', marginLeft: '10%' }}>Ads Banners</h2>

          <div className="ads-banner">
            <div className="ads-icon">
              <i className="fas fa-ad"></i>
            </div>
            {adsBanners.map((banner, index) => (
              <div key={`ads-${index}`} className="banner-box">
                {banner ? (
                  <div className="banner-container">
                    <img src={banner} alt={`Banner ${index + 1}`} className="banner-image" />
                    <label htmlFor={`ads-upload-${index}`} className="upload-label-e">
                      <i className="fa fa-edit"></i>
                      <input
                        type="file"
                        id={`ads-upload-${index}`}
                        accept="image/*"
                        onChange={(event) => handleImageUpload(event, index, setAdsBanners)}
                      />
                    </label>
                  </div>
                ) : (
                  <label htmlFor={`ads-upload-${index}`} className="upload-label">
                    <i style={{ fontSize: 100, color: '#ccc' }} className="fa fa-plus" />
                    <input
                      type="file"
                      id={`ads-upload-${index}`}
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event, index, setAdsBanners)}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
          <div className="session-creator">
            <button onClick={handleSessionClick}>Create Session</button>
          </div>
        </>
      )}
       <ToastContainer />
    </div>
  );
};

export default AppBanner;
