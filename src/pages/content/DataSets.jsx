import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import CommentIcon from "@mui/icons-material/Comment";
import AddIcon from "@mui/icons-material/Add"; // Import AddIcon
import VoicePopup from "../../components/VoicePopup";
import CommentsPopup from "../../components/CommentsPopup"; // Import CommentsPopup
import { useMoveToLead } from "../contextAPI/MoveToLeadContext"; // Use the context
const DataSets = ({ data }) => {
  const hardcodedHeaders = [
    "S. No.",
    "State",
    "City",
    "Name of the Institute",
    "Contact Person 1",
    "Contact Person 2",
    "Contact Number 1",
    "Contact Number 2",
    "Contact Number 3",
    "Exam 1",
    "Exam 2",
    "Exam 3",
    "Exam 4",
    "Exam 5",
    "Assigned Sales Manager",
  ];

  const [rows, setRows] = useState(data || []);
  const [isVoicePopupOpen, setIsVoicePopupOpen] = useState(false);
  const [isCommentsPopupOpen, setIsCommentsPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editCell, setEditCell] = useState(null); // Track the cell to be edited

  const { setMoveToLeadRow } = useMoveToLead(); // Access the context to update the "Move to Lead" row

  useEffect(() => {
    const storedRows = localStorage.getItem("dataRows");
    if (storedRows) {
      const parsedRows = JSON.parse(storedRows);
      const validRows = parsedRows.filter(
        (row) =>
          row &&
          (row.data.length === hardcodedHeaders.length || row.data.length === hardcodedHeaders.length - 1)
      );
      setRows(validRows);
    }
  }, [data, hardcodedHeaders.length]);

  const openVoicePopup = (rowIndex) => {
    setSelectedRow(rowIndex); // Set the selected row for the voice popup
    setIsVoicePopupOpen(true);
  };

  const closeVoicePopup = () => {
    setIsVoicePopupOpen(false);
  };

  const openCommentsPopup = (rowIndex) => {
    setSelectedRow(rowIndex);
    setIsCommentsPopupOpen(true);
  };

  const closeCommentsPopup = () => {
    setIsCommentsPopupOpen(false);
    setSelectedRow(null);
  };

  const handleCellClick = (rowIndex, colIndex) => {
    setEditCell({ rowIndex, colIndex });
  };

  const handleCellChange = (e, rowIndex, colIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].data[colIndex] = e.target.textContent;
    setRows(updatedRows);
    localStorage.setItem("dataRows", JSON.stringify(updatedRows));
  };

  const handleDateChange = (e, rowIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].date = e.target.value;
    setRows(updatedRows);
    localStorage.setItem("dataRows", JSON.stringify(updatedRows));
  };
  const handleStatusChange = (e, rowIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].status = e.target.value;
    setRows(updatedRows);
    localStorage.setItem("dataRows", JSON.stringify(updatedRows));
  
    // If the status is "Move to Lead", update the context with the correct row
    if (e.target.value === "Move to Lead") {
      const rowToMove = updatedRows[rowIndex];
      rowToMove.rowIndex = rowIndex; // Ensure rowIndex is included
      setMoveToLeadRow(rowToMove); // Set the row to "Move to Lead" in the context
    }
  };
  
  const addNewRow = () => {
    const newRow = {
      rowIndex: rows.length, // Assign rowIndex based on current length of rows
      data: Array(hardcodedHeaders.length-1).fill(""),
      date: "",
      status: "Not Interested",
    };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    localStorage.setItem("dataRows", JSON.stringify(updatedRows));
    alert("row added successfully");
  };
  

  return (
    <Box
      sx={{
        padding: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "Roboto",
      }}
    >
      <Box sx={{ flexGrow: 1, overflow: "auto", marginTop: 0 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "14px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
          }}
        >
          <thead>
            <tr>
              {hardcodedHeaders.map((header, index) => (
                <th key={index} style={headerStyle}>
                  {header}
                </th>
              ))}
              <th style={headerStyle}>Comments</th>
              <th style={headerStyle}>Date for Next Calling</th>
              <th style={headerStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} style={rowHoverStyle}>
                <td style={cellStyle}>{rowIndex + 1}</td>
                {row.data.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    style={cellStyle}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    contentEditable={editCell?.rowIndex === rowIndex && editCell?.colIndex === colIndex}
                    suppressContentEditableWarning
                    onBlur={(e) => handleCellChange(e, rowIndex, colIndex)}
                  >
                    {cell || "-"}
                  </td>
                ))}
                <td style={{ ...cellStyle, display: "flex" }}>
                  <IconButton onClick={() => openCommentsPopup(rowIndex)} color="primary">
                    <CommentIcon />
                  </IconButton>
                  <IconButton onClick={() => openVoicePopup(rowIndex)} color="primary">
                    <MicIcon />
                  </IconButton>
                </td>
                <td style={cellStyle}>
                  <input
                    type="date"
                    style={inputStyle}
                    value={row.date || ""}
                    onChange={(e) => handleDateChange(e, rowIndex)}
                  />
                </td>
                <td style={cellStyle}>
                  <select
                    style={selectStyle}
                    value={row.status || "Not Interested"}
                    onChange={(e) => handleStatusChange(e, rowIndex)}
                  >
                    <option value="Not Interested">Not Interested</option>
                    <option value="Not Picking">Not Picking</option>
                    <option value="Move to Lead">Move to Lead</option>
                    <option value="Call Again">Call Again</option>
                    <option value="Not Connected">Not Connected</option>
                    <option value="Wrong Data">Wrong Data</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <IconButton
          onClick={addNewRow}
          title="Add a row"
          sx={{
            backgroundColor: "#9C27B0",
            color: "#fff",
            "&:hover": { backgroundColor: "#9C27B0" },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {isVoicePopupOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <VoicePopup rowIndex={selectedRow} closeVoicePopup={closeVoicePopup} />
        </Box>
      )}

      {isCommentsPopupOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CommentsPopup rowIndex={selectedRow} closeCommentsPopup={closeCommentsPopup} />
        </Box>
      )}
    </Box>
    
  );
};

const headerStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  backgroundColor: "#f4f6f8",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "16px",
};

const cellStyle = {
  textAlign: "center",
  border: "1px solid #ddd",
  padding: "10px",
  transition: "background-color 0.2s",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
  boxSizing: "border-box",
  cursor: "pointer",
};

const selectStyle = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
  cursor: "pointer",
};

const rowHoverStyle = {
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: "#f9f9f9",
  },
};

export default DataSets;