import React, { useState } from 'react';
import {
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Import AddIcon

const Saleschoice = () => {
  const [customers, setCustomers] = useState([]); // State to store customer data
  const [showTable, setShowTable] = useState(false); // Toggle table visibility
  const [openDialog, setOpenDialog] = useState(false); // Control dialog open/close
  const [selectedRows, setSelectedRows] = useState([]); // Store selected rows

  const handleShowCustomers = () => {
    const customerData = JSON.parse(localStorage.getItem('customer')) || [];
    setCustomers(customerData);
    setShowTable(true); // Show the table
    setOpenDialog(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
  };

  const handleSendData = () => {
    // Log the selected rows (You can later replace this with actual send functionality)
    console.log("Selected Rows to send:", selectedRows);
  };

  const handleSelectRow = (customer, isSelected) => {
    setSelectedRows((prevSelectedRows) => {
      if (isSelected) {
        return [...prevSelectedRows, customer];
      } else {
        return prevSelectedRows.filter((row) => row.id !== customer.id);
      }
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
      }}
    >
      <Box textAlign="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleShowCustomers}
          sx={{
            padding: '10px',
            fontSize: '16px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            minWidth: '50px', // Set min width for button
            justifyContent: 'center', // Center the icon
            borderRadius: '50%', // Round button to make it circular
          }}
        >
          <AddIcon sx={{ fontSize: '30px' }} /> {/* Add the + icon */}
        </Button>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Customer Data</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '500px', overflowY: 'auto' }}>
          {showTable && customers.length > 0 && (
            <TableContainer
              component={Paper}
              sx={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ border: '1px solid #ddd' }}></TableCell>
                    {[
                      'No.',
                      'State',
                      'City',
                      'Name of the Institute',
                      'Contact Person 1',
                      'Contact Person 2',
                      'Contact Number 1',
                      'Contact Number 2',
                      'Contact Number 3',
                      'Exam 1',
                      'Exam 2',
                      'Exam 3',
                      'Exam 4',
                      'Exam 5',
                      'Assigned Sales Manager',
                    ].map((header, index) => (
                      <TableCell
                        key={index}
                        sx={{
                          fontWeight: 600,
                          backgroundColor: '#f0f0f0',
                          border: '1px solid #ddd',
                          padding: '10px',
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer, index) => (
                    <TableRow
                      key={customer.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f4f4f4',
                        },
                        transition: 'background-color 0.3s ease',
                      }}
                    >
                      <TableCell sx={{ padding: '10px', border: '1px solid #ddd' }}>
                        <Checkbox
                          onChange={(e) =>
                            handleSelectRow(customer, e.target.checked)
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ padding: '10px', border: '1px solid #ddd' }}>
                        {index + 1}
                      </TableCell>
                      {(customer.data || []).map((item, i) => (
                        <TableCell
                          key={`data-${index}-${i}`}
                          sx={{
                            padding: '10px',
                            border: '1px solid #ddd',
                          }}
                        >
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {showTable && customers.length === 0 && (
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                marginTop: '20px',
                color: '#ff5722',
              }}
            >
              No customer data found!
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {/* Close Button */}
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
          {/* Send Button */}
          <Button onClick={handleSendData} color="secondary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Saleschoice;
