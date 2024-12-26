import React from 'react';
import { useDrop } from 'react-dnd';
import { Typography } from '@mui/material';
import DraggableCard from '../Draggable'; // Ensure correct import path

const Step4 = ({ stepName, cards, setStepsData }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'CARD',
    drop: (item) => {
      const { row, fromStep } = item;
      if (fromStep !== stepName) {
        setStepsData((prevStepsData) => {
          const updatedFromStep = prevStepsData[fromStep].filter(
            (card) => card.id !== row.id
          );
          const updatedToStep = [...prevStepsData[stepName], row];

          const updatedStepsData = {
            ...prevStepsData,
            [fromStep]: updatedFromStep,
            [stepName]: updatedToStep,
          };

          // Update local storage
          localStorage.setItem("stepsData", JSON.stringify(updatedStepsData));
          return updatedStepsData;
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        padding: '20px',
        minWidth: '300px',
        flexShrink: 0,
        height: 'auto',
        backgroundColor: isOver ? '#f1f1f1' : '#9C27B0',
        borderRadius: '12px',
        margin: '10px 0',
        boxShadow: '0 4px 5px rgba(0, 0, 0, 0.2)',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: isOver ? '#9C27B0' : '#fff',
          marginBottom: '15px',
        }}
      >
        {stepName}
      </Typography>
      {cards?.length > 0 ? (
        cards.map((card, index) => (
          <DraggableCard
            key={card.id}
            row={card}
            fromStep={stepName}
            setStepsData={setStepsData}
            index={index}
            cards={cards}
          />
        ))
      ) : (
        <Typography
          variant="body2"
          sx={{
            fontStyle: 'italic',
            color: '#fff',
            textAlign: 'center',
            padding: '20px 0',
          }}
        >
          No cards here yet. Add some cards to get started!
        </Typography>
      )}
    </div>
  );
};

export default Step4;
