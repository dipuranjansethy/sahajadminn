import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'ui-component/cards/MainCard';
import {useNavigate} from 'react-router-dom'
import Loader from 'views/Loader';
const MerchantsData = () => {
  const [merchantsData, setMerchantsData] = useState([]);
   const [loading, setloading] = useState(true)
  const fetchData = async () => {
    try {
      const response = await axios.get('https://sahajback.vercel.app/merchant/API/businesses');
      setMerchantsData(response.data)
      setloading(false)
    } catch (error) {
      console.error('Error fetching merchants data:', error);
      setloading(false)

    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount
  const navigate = useNavigate();
  const handleView = (id) => {
    navigate(`/merchant/${id}`)
  };

 
  // const handleDeleteFromModal = async (id) => {
  //   try {
  //     await axios.delete(`https://sahajbackend.vercel.app/merchant/API/businesses/${id}`);
  //     console.log('Delete merchant with id:', id);
  //     fetchData();
  //   } catch (error) {
  //     console.error('Error deleting merchant:', error);
  //   }
  // };

  // const handleActivateFromModal = async (id) => {
  //   try {
  //     await axios.put(`https://sahajbackend.vercel.app/merchant/verify/${id}`);
  //     console.log('Activate merchant with id:', id);
  //     fetchData();
  //   } catch (error) {
  //     console.error('Error activating merchant:', error);
  //   }
  // };

  // const handleDeactivateFromModal = async (id) => {
  //   try {
  //     await axios.put(`https://sahajbackend.vercel.app/merchant/unverify/${id}`);
  //     console.log('Deactivate merchant with id:', id);
  //     fetchData();
  //   } catch (error) {
  //     console.error('Error Deactivating merchant:', error);
  //   }
  // };

  const getRowId = (row) => row._id;

  const columns = [
    { field: '_id', headerName: 'ID', hide: true },
    { field: 'businessName', headerName: 'Business Name', flex: 1 },
    { field: 'blockBuildingName', headerName: 'Block/Building Name', flex: 1 },
    { field: 'merchantName', headerName: 'Merchant Name', flex: 1 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleView(params.row._id)} variant="contained" sx={{ backgroundColor: '#673ab7', color: '#ffffff' }}>
            View
          </Button>
        </div>
      )
    }
  ];



  return (
    <MainCard title="ALL MERCHANTS DATA">
   {loading === true ? <Loader/> : 
   <>
   
   <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={merchantsData} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} getRowId={getRowId} />
      </div>
   </>
   
   }

    </MainCard> 
  );
};

export default MerchantsData;
