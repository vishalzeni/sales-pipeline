import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, Typography, Box, IconButton, Collapse } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import CommentIcon from '@mui/icons-material/Comment';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VoicePopup from '../../components/VoicePopup';
import CommentsPopup from '../../components/CommentsPopup';
import Offline from '../../components/Offline';
import axios from 'axios';

const Sales = () => {
  const [stepsData, setStepsData] = useState({
    Step1: [],
    Step2: [],
    Step3: [],
    Step4: [],
    Step5: [],
  });
  const [isVoicePopupOpen, setIsVoicePopupOpen] = useState(false);
  const [isCommentsPopupOpen, setIsCommentsPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isRequestFailed, setIsRequestFailed] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dataRows")
      .then((response) => {
        const rows = response.data.filter((row) => row.status === "Move to Lead");
        const steps = {
          Step1: [],
          Step2: [],
          Step3: [],
          Step4: [],
          Step5: [],
        };

        rows.forEach((row) => {
          const step = row.step || "Step1";
          steps[step].push({
            id: row.rowIndex,
            name: row.data[0],
            data: row.data,
            status: row.status,
            date: row.date,
            rowIndex: row.rowIndex,
            comments: row.comments,
            voiceData: row.voiceData,
          });
        });

        setStepsData(steps);
        setIsRequestFailed(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsRequestFailed(true);
      });
  }, []);

  const toggleCardExpand = (cardId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const updateCardStep = (rowIndex, newStep) => {
    axios
      .put(`http://localhost:5000/api/dataRows/${rowIndex}/step`, { step: newStep })
      .catch(console.error);
  };

  const CardItem = ({ row, fromStep, setStepsData, index, cards }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "CARD",
      item: { row, fromStep, index },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    const [, drop] = useDrop({
      accept: "CARD",
      hover: (item) => {
        if (item.fromStep === fromStep && item.index !== index) {
          const updatedCards = [...cards];
          const [movedCard] = updatedCards.splice(item.index, 1);
          updatedCards.splice(index, 0, movedCard);

          setStepsData((prev) => ({
            ...prev,
            [fromStep]: updatedCards,
          }));
          item.index = index;
        }
      },
    });

    const openPopup = (type) => {
      setSelectedRow(row.rowIndex);
      type === "voice" ? setIsVoicePopupOpen(true) : setIsCommentsPopupOpen(true);
    };

    const isExpanded = expandedCards[row.id] || false;

    return (
      <Card
        ref={(node) => drag(drop(node))}
        sx={{
          backgroundColor: isDragging ? "#9C27B0" : "#fff",
          color: isDragging ? "#fff" : "#9C27B0",
          margin: "8px 0",
          cursor: "move",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          minHeight: "56px",
          width: "100%",
          transition: 'all 0.3s ease',
        }}
      >
        <CardContent sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "8px 12px",
          gap: "4px"
        }}>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <Typography variant="subtitle1" sx={{
              fontWeight: 600,
              color: isDragging ? "#fff" : "#9C27B0",
              flexGrow: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              pr: 1
            }}>
              {row?.data[2] || "Unnamed Card"}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  openPopup("comments");
                }}
                size="small"
                sx={{ color: isDragging ? "#fff" : "#9C27B0" }}
              >
                <CommentIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  openPopup("voice");
                }}
                size="small"
                sx={{ color: isDragging ? "#fff" : "#9C27B0" }}
              >
                <MicIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCardExpand(row.id);
                }}
                size="small"
                sx={{ color: isDragging ? "#fff" : "#9C27B0" }}
              >
                {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={isExpanded}>
            <Box sx={{
              borderTop: "1px solid #eee",
              pt: 1,
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }}>
              {row.data &&
                row.data
                  .filter((field, idx) => field && field !== "-" && idx !== 2)
                  .map((field, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      sx={{
                        fontSize: "0.875rem",
                        color: isDragging ? "#fff" : "#555",
                        wordBreak: "break-word"
                      }}
                    >
                      {field}
                    </Typography>
                  ))}

              {row.date && (
                <Typography variant="caption" sx={{
                  color: isDragging ? "#fff" : "#888",
                  mt: 1,
                }}>
                  {new Date(row.date).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  const KanbanColumn = ({ stepName, cards }) => {
    const [{ isOver }, drop] = useDrop({
      accept: 'CARD',
      drop: (item) => {
        if (item.fromStep !== stepName) {
          setStepsData((prev) => {
            const updated = {
              ...prev,
              [item.fromStep]: prev[item.fromStep].filter((card) => card.id !== item.row.id),
              [stepName]: [...prev[stepName], item.row],
            };
  
            updateCardStep(item.row.rowIndex, stepName);
            return updated;
          });
        }
      },
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    });
  
    return (
      <div
        ref={drop}
        style={{
          padding: '16px',
          minWidth: '300px',
          backgroundColor: isOver ? '#f1f1f1' : '#9C27B0',
          borderRadius: '12px',
          margin: '10px',
          boxShadow: '0 4px 5px rgba(0, 0, 0, 0.2)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          height: '77vh',
          position: 'relative', // Added for positioning the add icon
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: isOver ? '#f1f1f1' : '#9C27B0',
          zIndex: 1,
          padding: '8px',
          borderRadius: '4px'
        }}>
          <Typography variant="h5" sx={{
            color: isOver ? '#9C27B0' : '#fff',
          }}>
            {stepName}
          </Typography>
          {stepName === 'Step1' && (
            <IconButton
              sx={{
                backgroundColor: '#fff',
                color: '#9C27B0',
                '&:hover': {
                  backgroundColor: '#f1f1f1',
                },
                width: '32px',
                height: '32px',
              }}
              onClick={() => {
                // Add your click handler here for adding a new card
                console.log('Add new card clicked');
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
          {cards?.length > 0 ? (
            cards.map((card, index) => (
              <CardItem
                key={card.id}
                row={card}
                fromStep={stepName}
                setStepsData={setStepsData}
                index={index}
                cards={cards}
              />
            ))
          ) : (
            <Card sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#fff',
              textAlign: 'center',
              py: 4
            }}>
              <Typography variant="body2">
                No cards here yet
              </Typography>
            </Card>
          )}
        </Box>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {isRequestFailed ? (
        <Offline />
      ) : (
        <Box sx={{
          display: 'flex',
          gap: '20px',
          padding: '20px',
          height: '90vh',
          overflowX: 'auto',
          backgroundColor: '#f9f9f9'
        }}>
          {Object.keys(stepsData).map((step) => (
            <KanbanColumn
              key={step}
              stepName={step}
              cards={stepsData[step]}
            />
          ))}
        </Box>
      )}

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
            closeVoicePopup={() => setIsVoicePopupOpen(false)}
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
            closeCommentsPopup={() => setIsCommentsPopupOpen(false)}
          />
        </Box>
      )}
    </DndProvider>
  );
};

export default Sales;
