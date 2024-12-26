import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/HomePage';  // Import Homepage component
import DataSets from './pages/content/DataSets';  // Import DataSets component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/datasets" element={<DataSets />} />  {/* Add route for DataSets */}
      </Routes>
    </Router>
  );
};

export default App;
