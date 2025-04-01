import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  IconButton,
  CircularProgress,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import CommentIcon from "@mui/icons-material/Comment";
import AddIcon from "@mui/icons-material/Add";
import SortIcon from "@mui/icons-material/Sort";
import VoicePopup from "../../components/VoicePopup";
import CommentsPopup from "../../components/CommentsPopup";
import Offline from "../../components/Offline";
import axios from "axios";

// Set base URL for Axios
axios.defaults.baseURL = "http://localhost:5000/api";

const DataSets = () => {
  const hardcodedHeaders = useMemo(
    () => [
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
    ],
    []
  );

  const [rows, setRows] = useState([]);
  const [isVoicePopupOpen, setIsVoicePopupOpen] = useState(false);
  const [isCommentsPopupOpen, setIsCommentsPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editCell, setEditCell] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestFailed, setIsRequestFailed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const tableEndRef = useRef(null);
  const [sortColumn, setSortColumn] = useState(0); // Default to the first column
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order is ascending

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchRows = useCallback(() => {
    setIsLoading(true);
    axios
      .get("/dataRows")
      .then((response) => {
        const validRows = response.data.filter(
          (row) => row && Array.isArray(row.data)
        );
        setRows(validRows);
        setIsRequestFailed(false);
        setSnackbarMessage("Data fetched successfully");
        setSnackbarOpen(true);
      })
      .catch(() => {
        setIsRequestFailed(true);
        setSnackbarMessage("Error fetching data");
        setSnackbarOpen(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const openVoicePopup = useCallback((rowIndex) => {
    setSelectedRow(rowIndex);
    setIsVoicePopupOpen(true);
  }, []);

  const closeVoicePopup = useCallback(
    (voiceData) => {
      if (voiceData) {
        setRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows[selectedRow].voiceData = voiceData;
          return updatedRows;
        });
        axios
          .put(`/dataRows/${selectedRow}`, {
            ...rows[selectedRow],
            voiceData,
          })
          .then(() => {
            setSnackbarMessage("Voice data updated successfully");
            setSnackbarOpen(true);
          })
          .catch((error) => {
            console.error("Error updating voice data:", error);
            setSnackbarMessage("Error updating voice data");
            setSnackbarOpen(true);
          });
      }
      setIsVoicePopupOpen(false);
    },
    [selectedRow, rows]
  );

  const openCommentsPopup = useCallback((rowIndex) => {
    setSelectedRow(rowIndex);
    setIsCommentsPopupOpen(true);
  }, []);

  const closeCommentsPopup = useCallback(
    (comment) => {
      if (comment) {
        setRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows[selectedRow].comments = comment;
          return updatedRows;
        });
        axios
          .put(`/dataRows/${selectedRow}`, {
            ...rows[selectedRow],
            comments: comment,
          })
          .then(() => {
            setSnackbarMessage("Comments updated successfully");
            setSnackbarOpen(true);
          })
          .catch((error) => {
            console.error("Error updating comments:", error);
            setSnackbarMessage("Error updating comments");
            setSnackbarOpen(true);
          });
      }
      setIsCommentsPopupOpen(false);
    },
    [selectedRow, rows]
  );

  const handleCellClick = useCallback((rowIndex, colIndex) => {
    setEditCell({ rowIndex, colIndex });
  }, []);

  const handleCellBlur = useCallback(
    debounce((e, rowIndex, colIndex) => {
      setRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex].data[colIndex] = e.target.textContent;
        return updatedRows;
      });
      axios
        .put(`/dataRows/${rowIndex}`, {
          ...rows[rowIndex],
          data: rows[rowIndex].data,
        })
        .then(() => {
          setSnackbarMessage("Cell updated successfully");
          setSnackbarOpen(true);
        })
        .catch(() => {
          setSnackbarMessage("Error updating cell");
          setSnackbarOpen(true);
        });
    }, 300),
    [rows]
  );

  const handleDateChange = useCallback(
    (e, rowIndex) => {
      const newDate = e.target.value;
      setRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex].date = newDate;
        return updatedRows;
      });
      axios
        .put(`/dataRows/${rowIndex}`, {
          ...rows[rowIndex],
          date: newDate,
        })
        .then(() => {
          setSnackbarMessage("Date updated successfully");
          setSnackbarOpen(true);
        })
        .catch(() => {
          setSnackbarMessage("Error updating date");
          setSnackbarOpen(true);
        });
    },
    [rows]
  );

  const handleStatusChange = useCallback(
    (e, rowIndex) => {
      const newStatus = e.target.value;
      setRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex].status = newStatus;
        return updatedRows;
      });
      axios
        .put(`/dataRows/${rowIndex}`, {
          ...rows[rowIndex],
          status: newStatus,
        })
        .then(() => {
          setSnackbarMessage("Status updated successfully");
          setSnackbarOpen(true);
        })
        .catch(() => {
          setSnackbarMessage("Error updating status");
          setSnackbarOpen(true);
        });
    },
    [rows]
  );

  const handleAddRowClick = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const confirmAddRow = useCallback(() => {
    setIsDialogOpen(false);
    const newRow = {
      rowIndex: rows.length,
      data: Array(hardcodedHeaders.length - 1).fill(""),
      date: "",
      status: "Not Interested",
    };
    axios
      .post("/addRow", newRow)
      .then((response) => {
        const savedRow = response.data;
        const updatedRows = [...rows, savedRow];
        setRows(updatedRows);
        setSnackbarMessage("Row added successfully");
        setSnackbarOpen(true);
        setTimeout(() => {
          tableEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
        setSnackbarMessage("Error adding row");
        setSnackbarOpen(true);
      });
  }, [rows, hardcodedHeaders]);

  const cancelAddRow = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const handleGlobalSort = useCallback(() => {
    setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc")); // Invert sorting order on click
  }, []);

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const aValue = a.data[sortColumn] || "";
      const bValue = b.data[sortColumn] || "";
      return sortOrder === "desc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [rows, sortColumn, sortOrder]);

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
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : isRequestFailed ? (
        <Offline />
      ) : rows.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", marginTop: 2 }}>
          No data available.
        </Typography>
      ) : (
        <>
          <Box sx={{ flexGrow: 1, overflow: "auto", marginTop: 0 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: "14px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                borderRadius: "8px",
                backgroundColor: "#fff",
              }}
            >
              <thead>
                <tr>
                  {hardcodedHeaders.map((header, index) => (
                    <th key={index} style={headerStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span>{header}</span>
                      </div>
                    </th>
                  ))}
                  <th style={headerStyle}>Comments</th>
                  <th style={headerStyle}>Date for Next Calling</th>
                  <th style={{ ...headerStyle, minWidth: "160px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row, displayIndex) => (
                  <tr
                    key={row.rowIndex}
                    style={{
                      ...rowHoverStyle,
                      backgroundColor:
                        displayIndex % 2 === 0 ? "#ffffff" : "#f9f9f9",
                    }}
                  >
                    <td style={cellStyle}>{displayIndex + 1}</td>
                    {hardcodedHeaders.slice(1).map((_, colIndex) => (
                      <td
                        key={colIndex}
                        style={cellStyle}
                        contentEditable={
                          editCell?.rowIndex === row.rowIndex &&
                          editCell?.colIndex === colIndex
                        }
                        suppressContentEditableWarning
                        onClick={() => handleCellClick(row.rowIndex, colIndex)}
                        onBlur={(e) =>
                          handleCellBlur(e, row.rowIndex, colIndex)
                        }
                      >
                        {row.data[colIndex] || "-"}
                      </td>
                    ))}
                    <td
                      style={{
                        ...cellStyle,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Tooltip title="Add/View Comments" arrow>
                        <IconButton
                          onClick={() => openCommentsPopup(row.rowIndex)}
                          color="primary"
                          size="small"
                        >
                          <CommentIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Record Voice Note" arrow>
                        <IconButton
                          onClick={() => openVoicePopup(row.rowIndex)}
                          color="success"
                          size="small"
                        >
                          <MicIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="date"
                        style={inputStyle}
                        value={row.date || ""}
                        onChange={(e) => handleDateChange(e, row.rowIndex)}
                      />
                    </td>
                    <td style={{ ...cellStyle, padding: "8px" }}>
                      <select
                        style={{
                          ...selectStyle,
                          padding: "10px",
                          fontSize: "14px",
                        }}
                        value={row.status || "Not Interested"}
                        onChange={(e) => handleStatusChange(e, row.rowIndex)}
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
            <div ref={tableEndRef} />
          </Box>
          <Box
            sx={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              display: "flex",
              gap: "10px",
            }}
          >
            <Tooltip title="Sort Table" arrow>
              <IconButton
                onClick={handleGlobalSort}
                sx={{
                  backgroundColor: "#2196F3",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#1976D2" },
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                }}
              >
                <SortIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add New Row" arrow>
              <IconButton
                onClick={handleAddRowClick}
                sx={{
                  backgroundColor: "#9C27B0",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#7B1FA2" },
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}

      <Dialog open={isDialogOpen} onClose={cancelAddRow}>
        <DialogTitle>Confirm Add Row</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to add a new row?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelAddRow} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmAddRow} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

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
          <VoicePopup
            rowIndex={selectedRow}
            closeVoicePopup={closeVoicePopup}
          />
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
          <CommentsPopup
            rowIndex={selectedRow}
            closeCommentsPopup={closeCommentsPopup}
          />
        </Box>
      )}
    </Box>
  );
};

const headerStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  backgroundColor: "#e0e0e0",
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
  backgroundColor: "#fff",
  "&:hover": { borderColor: "#888" },
};

const selectStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
  cursor: "pointer",
  backgroundColor: "#fff",
  "&:hover": { borderColor: "#888" },
};

const rowHoverStyle = {
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
};

export default DataSets;
