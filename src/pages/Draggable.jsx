import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import CommentIcon from "@mui/icons-material/Comment";
import VoicePopup from "../components/VoicePopup";
import CommentsPopup from "../components/CommentsPopup"; // Import CommentsPopup

const DraggableCard = ({ row, fromStep, setStepsData, index, cards }) => {
  const [isVoicePopupOpen, setIsVoicePopupOpen] = useState(false);
  const [isCommentsPopupOpen, setIsCommentsPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const openVoicePopup = () => {
    setSelectedRow(row.rowIndex); // Set the selected row index for the voice popup
    setIsVoicePopupOpen(true);
  };

  const closeVoicePopup = () => {
    setIsVoicePopupOpen(false);
  };

  const openCommentsPopup = () => {
    setSelectedRow(row.rowIndex); // Set the selected row index for the comments popup
    setIsCommentsPopupOpen(true);
  };

  const closeCommentsPopup = () => {
    setIsCommentsPopupOpen(false);
    setSelectedRow(null); // Reset the selected row when closing
  };

  // Drag behavior setup
  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { row, fromStep, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop behavior setup
  const [, drop] = useDrop({
    accept: "CARD",
    hover: (item) => {
      if (item.fromStep === fromStep && item.index !== index) {
        const updatedCards = [...cards];
        const [movedCard] = updatedCards.splice(item.index, 1);
        updatedCards.splice(index, 0, movedCard);

        setStepsData((prevStepsData) => {
          const updatedStepsData = {
            ...prevStepsData,
            [fromStep]: updatedCards,
          };
          localStorage.setItem("stepsData", JSON.stringify(updatedStepsData));
          return updatedStepsData;
        });

        item.index = index;
      }
    },
  });

  return (
    <>
      <Card
        ref={(node) => drag(drop(node))}
        sx={{
          backgroundColor: isDragging ? "#9C27B0" : "#fff",
          color: isDragging ? "#fff" : "#9C27B0",
          margin: "8px 0",
          cursor: "move",
          width: "auto",
          minHeight: "200px", // Adjust height automatically
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional: Add a subtle shadow
          borderRadius: "8px",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "16px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {row?.data[2] || "Unnamed Card"}
          </Typography>
          <div>
            {row.data ? (
              <div>
                <div style={{display:'flex', gap:'5px'}}>
                  {row.data[0] && <div>{row.data[0]},</div>}
                  {row.data[1] && <div>{row.data[1]}</div>}
                </div>
                <div style={{display:'flex', gap:'5px'}}>
                {row.data[2] && <div>{row.data[3]},</div>}
                {row.data[3] && <div>{row.data[4]}</div>}
</div>
<div style={{display:'flex', gap:'5px'}}>
                {row.data[4] && <div>{row.data[5]},</div>}
                {row.data[5] && <div>{row.data[6]},</div>}
                {row.data[6] && <div>{row.data[7]}</div>}
</div>
                {row.data[7] && <div>{row.data[13]}</div>}
              </div>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No data available
              </Typography>
            )}
          </div>

          {/* Hardcoded icons always visible */}
          <div>
            <IconButton
              onClick={() => openCommentsPopup(row.rowIndex)}
              color="primary"
            >
              <CommentIcon />
            </IconButton>
            <IconButton
              onClick={() => openVoicePopup(row.rowIndex)}
              color="primary"
            >
              <MicIcon />
            </IconButton>
          </div>
        </CardContent>
      </Card>

      {/* Voice Popup */}
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

      {/* Comments Popup */}
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
    </>
  );
};

export default DraggableCard;
