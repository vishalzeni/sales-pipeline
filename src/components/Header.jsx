import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ toggleSidebar }) => {
  return (
    <AppBar
      position="sticky"
      color="primary"
      sx={{
        backgroundColor: '#9C27B0', // Purple background color
        color: '#FFFFFF',           // White text color
        height: '64px',             // Fixed height for header
      }}
    >
      <Toolbar sx={{ height: '100%' }}> {/* Ensure Toolbar takes full height */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{
            color: '#FFFFFF', // White icon color
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sales Pipeline
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
