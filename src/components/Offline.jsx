import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import { motion } from 'framer-motion';

function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        p: 4,
        borderRadius: '24px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        color: '#333',
        marginTop: '10vh',
      }}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CloudOffIcon 
          sx={{ fontSize: 80, color: 'orange', mb: 2 }}
        />
      </motion.div>
      
      <Typography variant="h4" component="h1" gutterBottom>
        You're Offline
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph sx={{ color: '#555', textAlign: 'center' }}>
        It seems you've lost your internet connection. Please check your network settings and try again.
      </Typography>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="contained"
          sx={{ mt: 3, px: 2, py: 1, borderRadius: '12px', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'none', backgroundColor: '#7b1fa2', color: '#fff', '&:hover': { backgroundColor: '#6a1b9a' } }}
          startIcon={<RefreshIcon />}
          onClick={handleRetry}
        >
          Retry
        </Button>
      </motion.div>
    </Box>
  );
}

export default OfflinePage;
