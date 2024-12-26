import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { Typography } from '@mui/material';
import DraggableCard from '../Draggable';

const Step1 = ({ stepName, cards, setStepsData, moveToLeadRow }) => {
  useEffect(() => {
    if (moveToLeadRow?.data?.length > 0) {
      const newCard = {
        id: Date.now(), // Unique ID for the card
        data: {
          state: moveToLeadRow.data[0],
          city: moveToLeadRow.data[1],
          instituteName: moveToLeadRow.data[2],
          contactPerson1: moveToLeadRow.data[3],
          contactPerson2: moveToLeadRow.data[4],
          contactNumber1: moveToLeadRow.data[5],
          contactNumber2: moveToLeadRow.data[6],
          contactNumber3: moveToLeadRow.data[7],
          exam1: moveToLeadRow.data[8],
          exam2: moveToLeadRow.data[9],
          exam3: moveToLeadRow.data[10],
          exam4: moveToLeadRow.data[11],
          exam5: moveToLeadRow.data[12],
          assignedSalesManager: moveToLeadRow.data[13],
          comments: moveToLeadRow.data[14],
          nextCallingDate: moveToLeadRow.date,
          status: moveToLeadRow.status,
        },
      };

      setStepsData((prevStepsData) => {
        const updatedStepsData = {
          ...prevStepsData,
          Step1: [...prevStepsData.Step1, newCard],
        };
        localStorage.setItem("stepsData", JSON.stringify(updatedStepsData));
        return updatedStepsData;
      });
    }
  }, [moveToLeadRow, setStepsData]);

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

export default Step1;
