import React, { useState, useRef, useEffect } from "react";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import SendIcon from "@mui/icons-material/Send";
import ReplayIcon from "@mui/icons-material/Replay";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import axios from "axios";

axios.defaults.baseURL = "http://82.112.236.241:6001/api"; // Set base URL for Axios

const VoicePopup = ({ rowIndex, closeVoicePopup }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [recordingToDelete, setRecordingToDelete] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);

  // Fetch recordings from the server
  useEffect(() => {
    axios
      .get(`/dataRows/${rowIndex}`) // Use base URL
      .then((response) => {
        setRecordings(response.data.voiceData || []);
      })
      .catch((error) => console.error("Error fetching voice data:", error));
  }, [rowIndex]);

  const saveRecordingToServer = (newRecordingBlob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      const timestamp = new Date().toLocaleString();
      const newRecording = { audio: base64String, timestamp };

      const updatedRecordings = [...recordings, newRecording];
      setRecordings(updatedRecordings);

      axios
        .put(`/dataRows/${rowIndex}/voiceData`, { voiceData: updatedRecordings }) // Use base URL
        .catch((error) => console.error("Error saving voice data:", error));
    };
    reader.readAsDataURL(newRecordingBlob);
  };

  const handleOpenDeleteDialog = (index) => {
    setRecordingToDelete(index);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setRecordingToDelete(null);
  };

  const handleDeleteRecording = () => {
    const updatedRecordings = recordings.filter((_, i) => i !== recordingToDelete);
    setRecordings(updatedRecordings);

    axios
      .put(`/dataRows/${rowIndex}/voiceData`, { voiceData: updatedRecordings }) // Use base URL
      .catch((error) => console.error("Error deleting voice data:", error));

    handleCloseDeleteDialog();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing the microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setRecording(false);
  };

  const handleSendRecording = () => {
    if (audioUrl) {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      saveRecordingToServer(audioBlob);
      setAudioUrl(null);
    }
  };

  const handleReRecord = () => {
    setAudioUrl(null);
    startRecording();
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "12px",
        maxWidth: "500px",
        width: "90%",
        zIndex: 1001,
        position: "relative",
        height: "auto",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#9c27b0",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-track": {
          borderRadius: "10px",
        },
      }}
    >
      <IconButton
        onClick={closeVoicePopup}
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: "#000",
          "&:hover": {
            backgroundColor: "#f1f1f1",
          },
        }}
      >
        X
      </IconButton>

      <Typography variant="h6" align="center" sx={{ marginBottom: "12px", color: "#333" }}>
        Saved Recordings for Row {rowIndex + 1}
      </Typography>

      {recordings.length > 0 && (
        <Box sx={{ marginBottom: "20px" }}>
          {recordings.map((recording, index) => (
            <Box key={index} sx={{ marginTop: "12px", textAlign: "center", position: "relative", marginBottom: "20px" }}>
              <audio controls src={`data:audio/wav;base64,${recording.audio}`} style={{ maxWidth: "250px", borderRadius: "8px" }} />
              <Typography variant="body2" sx={{ marginTop: "0px", fontStyle: "italic", color: "#777" }}>
                {recording.timestamp}
              </Typography>
              <IconButton
                onClick={() => handleOpenDeleteDialog(index)}
                sx={{
                  position: "absolute",
                  top: "35%",
                  right: "-2px",
                  transform: "translateY(-50%)",
                  color: "#d32f2f",
                  fontSize: "22px",
                  "&:hover": {
                    backgroundColor: "#f8bbd0",
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {!audioUrl && (
            <IconButton
              onClick={startRecording}
              disabled={recording}
              sx={{
                fontSize: "60px",
                color: "#00796b",
                transition: "transform 0.2s ease",
                "&:hover": {
                  backgroundColor: "#e0f2f1",
                  transform: "scale(1.1)",
                },
              }}
            >
              <MicIcon />
            </IconButton>
          )}

          {recording && (
            <IconButton
              onClick={stopRecording}
              sx={{
                fontSize: "60px",
                color: "#d32f2f",
                transition: "transform 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f8bbd0",
                  transform: "scale(1.1)",
                },
              }}
            >
              <StopIcon />
            </IconButton>
          )}

          {audioUrl && (
            <IconButton
              onClick={handleSendRecording}
              sx={{
                fontSize: "60px",
                color: "#1976d2",
                transition: "transform 0.2s ease",
                "&:hover": {
                  backgroundColor: "#bbdefb",
                  transform: "scale(1.1)",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          )}

          {audioUrl && (
            <IconButton
              onClick={handleReRecord}
              sx={{
                fontSize: "60px",
                color: "#0288d1",
                transition: "transform 0.2s ease",
                "&:hover": {
                  backgroundColor: "#bbdefb",
                  transform: "scale(1.1)",
                },
              }}
            >
              <ReplayIcon />
            </IconButton>
          )}
        </div>
      </Box>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to delete this recording?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteRecording} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VoicePopup;
