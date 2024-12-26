import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const MoveToLeadContext = createContext();

// Custom hook to use the context
export const useMoveToLead = () => {
  return useContext(MoveToLeadContext);
};

// Provider component to wrap around the app and provide context value
export const MoveToLeadProvider = ({ children }) => {
  const [moveToLeadRow, setMoveToLeadRow] = useState(null);
  const [rowIndex, setRowIndex] = useState(null); // Track the row index

  // Function to clear context data
  const clearMoveToLeadData = () => {
    setMoveToLeadRow(null); // Clear moveToLeadRow
    setRowIndex(null);      // Clear rowIndex
  };

  // Log moveToLeadRow when it changes
  useEffect(() => {
    if (moveToLeadRow) {
      console.log("New data in moveToLeadRow:", moveToLeadRow);
    }
  }, [moveToLeadRow]);

  return (
    <MoveToLeadContext.Provider value={{ moveToLeadRow, setMoveToLeadRow, rowIndex, setRowIndex, clearMoveToLeadData }}>
      {children}
    </MoveToLeadContext.Provider>
  );
};
