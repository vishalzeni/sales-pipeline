import React, { useState } from 'react';
import Header from '../components/Header';
import ContentArea from './ContentArea';

const Homepage = () => {
  const [openSidebar, setOpenSidebar] = useState(true);

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header toggleSidebar={toggleSidebar} />
      <ContentArea openSidebar={openSidebar} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default Homepage;
