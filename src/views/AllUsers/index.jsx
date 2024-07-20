import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Typography, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'ui-component/cards/MainCard';

const UserData = () => {
  const [merchantsData, setMerchantsData] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://sahajapi.vercel.app/user/getAllUsers');
      setMerchantsData(response.data);
    } catch (error) {
      console.error('Error fetching merchants data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  
  const handleView = (id) => {
    // Fetch data for the selected merchant
    const selectedMerchantData = merchantsData.find((merchant) => merchant._id === id);
    setSelectedMerchant(selectedMerchantData);

    // Open the modal
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    // Close the modal
    setOpenModal(false);
  };

  const handleDelete = async (id) => {
    try {
      // Delete request using Axios
      await axios.delete(`https://sahajapi.vercel.app/merchant/API/businesses/${id}`);

      // Implement your delete logic here using the merchant id
      console.log('Delete merchant with id:', id);

      // Close the modal after deletion
      setOpenModal(false);

      // Fetch updated data and re-render the datagrid
      fetchData();
    } catch (error) {
      console.error('Error deleting merchant:', error);
    }
  };

  
  const getRowId = (row) => row._id; // Specify the unique id for each row

  const columns = [
    { field: '_id', headerName: 'ID', hide: true },
    { field: 'userName', headerName: 'User Name', flex: 1 },
    { field: 'Mobile', headerName: 'Mobile', flex: 1 },
    { field: 'date', headerName: 'Join Date', flex: 1 },
 
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   flex: 1,
    //   renderCell: (params) => (
    //     <div>
    //       <Button onClick={() => handleView(params.row._id)} variant="contained" sx={{ backgroundColor: '#673ab7', color: '#ffffff' }}>
    //         View
    //       </Button>
    //     </div>
    //   )
    // }
  ];

  return (
    <MainCard title="ALL USER DATA">
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={merchantsData} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} getRowId={getRowId} />
      </div>
    </MainCard>
  );
};

export default UserData;
