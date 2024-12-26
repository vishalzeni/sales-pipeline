import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Sales1 from '../salesSteps/Sales1';  // Renamed component
import Sales2 from '../salesSteps/Sales2';  // Renamed component
import Sales3 from '../salesSteps/Sales3';  // Renamed component
import Sales4 from '../salesSteps/Sales4';  // Renamed component
import Sales5 from '../salesSteps/Sales5';  // Renamed component

const Sales = () => {
  const [stepsData, setStepsData] = useState({
    Sales1: [],
    Sales2: [],
    Sales3: [],
    Sales4: [],
    Sales5: [],
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: 'flex',
          gap: '20px',
          padding: '20px',
          height: '90vh',
          overflowX: 'scroll',
          backgroundColor: '#f9f9f9',
          boxSizing: 'border-box',
        }}
      >
        <Sales1
          stepName="Sales1"
          cards={stepsData.Sales1}  
          setStepsData={setStepsData}
        />
        <Sales2 stepName="Sales2" cards={stepsData.Sales2} setStepsData={setStepsData} />
        <Sales3 stepName="Sales3" cards={stepsData.Sales3} setStepsData={setStepsData} />
        <Sales4 stepName="Sales4" cards={stepsData.Sales4} setStepsData={setStepsData} />
        <Sales5 stepName="Sales5" cards={stepsData.Sales5} setStepsData={setStepsData} />
      </div>
    </DndProvider>
  );
};

export default Sales;
