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

const CommentsPopup = ({ rowIndex, closeCommentsPopup }) => {
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null); // Index of the comment to delete
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog visibility

  // Load comments for the selected row from local storage
  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
    setCommentsList(storedComments[rowIndex] || []);
  }, [rowIndex]);

  // Handle new comment addition
  const handleAddComment = () => {
    if (comment.trim() === "") return;

    const timestamp = new Date().toLocaleString(); // Get the current date and time
    const newComment = { text: comment, timestamp };

    const updatedComments = [...commentsList, newComment];
    setCommentsList(updatedComments);
    setComment(""); // Clear input

    // Save to local storage
    const allComments = JSON.parse(localStorage.getItem("comments")) || {};
    allComments[rowIndex] = updatedComments;
    localStorage.setItem("comments", JSON.stringify(allComments));
  };

  // Open confirmation dialog
  const openDeleteConfirmation = (index) => {
    setDeleteIndex(index);
    setIsDialogOpen(true);
  };

  // Confirm and delete the comment
  const handleDeleteComment = () => {
    const updatedComments = commentsList.filter((_, i) => i !== deleteIndex);
    setCommentsList(updatedComments);

    // Update local storage
    const allComments = JSON.parse(localStorage.getItem("comments")) || {};
    allComments[rowIndex] = updatedComments;
    localStorage.setItem("comments", JSON.stringify(allComments));

    // Close dialog
    setIsDialogOpen(false);
    setDeleteIndex(null);
  };

  // Close dialog without deleting
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
        position: "relative", // For positioning the close icon
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
              <Typography
                sx={{
                  textAlign: "left",
                  fontSize: "14px",
                }}
              >
                {index + 1}. {item.text}
                <br />
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#888",
                  }}
                >
                  {item.timestamp}
                </Typography>
              </Typography>
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
