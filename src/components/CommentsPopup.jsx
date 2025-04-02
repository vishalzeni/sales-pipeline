import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

axios.defaults.baseURL = "https://sales-api-ajag.onrender.com/api"; // Set base URL for Axios

const CommentsPopup = ({ rowIndex, closeCommentsPopup }) => {
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch comments from the server
  useEffect(() => {
    if (rowIndex !== null && rowIndex !== undefined) {
      axios
        .get(`/dataRows/${rowIndex}`) // Use base URL
        .then((response) => {
          setCommentsList(response.data.comments || []);
        })
        .catch((error) => {
          console.error("Error fetching comments:", error.response?.data || error.message);
        });
    }
  }, [rowIndex]);

  const handleAddComment = () => {
    if (comment.trim() === "") return;

    const timestamp = new Date().toLocaleString();
    const newComment = { text: comment, timestamp };

    const updatedComments = [...commentsList, newComment];
    setCommentsList(updatedComments);

    axios
      .put(`/dataRows/${rowIndex}/comments`, { comments: updatedComments }) // Use base URL
      .catch((error) => {
        console.error("Error saving comments:", error.response?.data || error.message);
      });

    setComment("");
  };

  const openDeleteConfirmation = (index) => {
    setDeleteIndex(index);
    setIsDialogOpen(true);
  };

  const handleDeleteComment = () => {
    const updatedComments = commentsList.filter((_, i) => i !== deleteIndex);
    setCommentsList(updatedComments);

    axios
      .put(`/dataRows/${rowIndex}/comments`, { comments: updatedComments }) // Use base URL
      .catch((error) => console.error("Error deleting comment:", error));

    setIsDialogOpen(false);
    setDeleteIndex(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setDeleteIndex(null);
  };

  return (
    <Box
      sx={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "500px",
        width: "90%",
        textAlign: "center",
        position: "relative",
      }}
      
    >
      {/* Close Icon */}
      <IconButton
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: "#555",
        }}
        onClick={closeCommentsPopup}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h6" sx={{ marginBottom: "16px" }}>
        Comments for Row {rowIndex + 1}
      </Typography>

      {/* List of Comments */}
      <Box
        sx={{
          height: "100%",
          maxHeight: "300px",
          overflowY: "scroll",
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        {commentsList.length > 0 ? (
          commentsList.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                padding: "8px",
                background: "#f4f4f4",
                borderRadius: "4px",
              }}
            >
              <Box sx={{ textAlign: "left", fontSize: "14px" }}>
                <Typography>{index + 1}. {item.text}</Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#888",
                  }}
                >
                  {item.timestamp}
                </Typography>
              </Box>
              <IconButton
                color="error"
                onClick={() => openDeleteConfirmation(index)}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No comments added yet.
          </Typography>
        )}
      </Box>

      {/* Input and Send Button */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          placeholder="Type a comment..."
          multiline
          rows={2}
          variant="outlined"
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ flexGrow: 1, marginRight: "8px" }}
        />
        <IconButton
          color="primary"
          onClick={handleAddComment}
          disabled={!comment.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteComment} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommentsPopup;
