import React, { useState } from 'react';
import {
  Button,
  TextField,
  Box,
  Grid,
  CircularProgress,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

export default function Home({ setUploadedData }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [previewMode, setPreviewMode] = useState(true);

  const handleFileChange = (event) => {
    parseFile(event.target.files[0]);
  };

  const parseFile = (selectedFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const ab = e.target.result;
      const wb = XLSX.read(ab, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (rows.length > 0) {
        setParsedData(rows); // Set parsed data for preview
        setOpenDialog(true); // Open the preview dialog
      } else {
        alert('No data found in the uploaded file.');
      }
    };

    reader.onerror = (error) => {
      alert('Error reading file: ' + error);
    };

    reader.readAsArrayBuffer(selectedFile);
    setFile(selectedFile); // Store the selected file
  };

  const onDrop = (acceptedFiles) => {
    parseFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.xlsx',
    multiple: false,
  });

  const handleConfirmUpload = () => {
    if (parsedData) {
      setLoading(true);
  
      setTimeout(() => {
        const dataRows = parsedData.slice(1); // Skip headers
  
        // Ensure each row is an array before using map
        const cleanedDataRows = dataRows.map((row, rowIndex) => {
          if (Array.isArray(row)) {
            return {
              data: row.slice(1), // Clean data (remove first column)
              rowIndex, // Use rowIndex as the unique identifier
            };
          } else {
            console.error("Row is not an array:", row);
            return null; // Return null if the row is not an array
          }
        }).filter(row => row !== null); // Remove any null rows
  
        // Fetch existing data from localStorage
        const existingData = JSON.parse(localStorage.getItem('dataRows')) || [];
  
        // Add new rows to existing data
        const updatedData = [...existingData, ...cleanedDataRows];
  
        // Store updated data in localStorage
        localStorage.setItem('dataRows', JSON.stringify(updatedData));
  
        setUploadedData(updatedData); // Update the parent state
        setParsedData(null);
        setFile(null);
        setLoading(false);
        setOpenDialog(false);
        alert('Data uploaded successfully!');
      }, 2000);
    }
  };

  const handleCloseDialog = () => {
    setParsedData(null);
    setFile(null);
    setOpenDialog(false);
  };

  const handleSwitchToPreview = () => {
    setPreviewMode(true);
  };

  const handleSwitchToConfirmation = () => {
    setPreviewMode(false);
  };

  return (
    <Box sx={{ padding: 3, height: '83vh' }}>
      {/* File Input Section */}
      <Box sx={{ marginBottom: 3 }}>
        <form >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                type="file"
                variant="outlined"
                fullWidth
                onChange={handleFileChange}
                label="Upload Excel"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </form>
      </Box>

      {/* Drag and Drop Section */}
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #9C27B0',
          padding: '20px',
          height: '100%',
          maxHeight: '400px',
          textAlign: 'center',
          cursor: 'pointer',
          background: '#f9f9f9',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          Drag & Drop / click to select a file to upload.
        </Typography>
      </Box>

      {/* Dialog for Preview and Confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {previewMode ? 'Data Preview' : 'Confirm Upload'}
        </DialogTitle>
        <DialogContent>
          {previewMode ? (
            <Box sx={{ marginTop: 2, maxHeight: 300, overflow: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {parsedData &&
                      parsedData[0].map((header, index) => (
                        <TableCell
                          key={index}
                          align="center"
                          sx={{
                            border: '1px solid #ddd', // Border added
                            padding: '8px',
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parsedData &&
                    parsedData.slice(1).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell
                            key={cellIndex}
                            align="center"
                            sx={{
                              border: '1px solid #ddd', // Border added
                              padding: '8px',
                            }}
                          >
                            {cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Typography variant="body1">
              Are you sure you want to upload the file: {file?.name}?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {previewMode ? (
            <Button onClick={handleSwitchToConfirmation} color="primary">
              Confirm
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmUpload} color="secondary">
                {loading ? <CircularProgress size={20} /> : 'Upload'}
              </Button>
            </>
          )}
          {!previewMode && (
            <Button onClick={handleSwitchToPreview} color="primary">
              Preview
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
