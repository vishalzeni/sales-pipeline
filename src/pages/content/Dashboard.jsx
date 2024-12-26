import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Step1 from '../steps/Step1';
import Step2 from '../steps/Step2';
import Step3 from '../steps/Step3';
import Step4 from '../steps/Step4';
import Step5 from '../steps/Step5';
import { useMoveToLead } from '../contextAPI/MoveToLeadContext';  // Import context hook

const Dashboard = () => {
  const [stepsData, setStepsData] = useState({
    Step1: [],
    Step2: [],
    Step3: [],
    Step4: [],
    Step5: [],
  });

  const { moveToLeadRow, clearMoveToLeadData } = useMoveToLead();  // Access moveToLeadRow from context

  // Load stepsData from localStorage on component mount
  useEffect(() => {
    const savedStepsData = JSON.parse(localStorage.getItem('stepsData'));
    if (savedStepsData) {
      setStepsData(savedStepsData);
    } else {
      console.log('No data found in localStorage');
    }
  }, []);

  // Save stepsData to localStorage
  useEffect(() => {
    if (!localStorage.getItem('stepsData')) {
      localStorage.setItem('stepsData', JSON.stringify(stepsData));
    }
  }, [stepsData]);  // Run when stepsData is updated

  // Update stepsData when moveToLeadRow changes
  useEffect(() => {
    if (moveToLeadRow && moveToLeadRow.data && moveToLeadRow.data.length > 0) {
      setStepsData((prevData) => {
        const updatedStepsData = {
          ...prevData,
          Step1: [...prevData.Step1, {
            id: Date.now(),  
            name: moveToLeadRow.data[0], 
            data: moveToLeadRow.data,    
            status: moveToLeadRow.status,
            date: moveToLeadRow.date,
            rowIndex: moveToLeadRow.rowIndex, // Add rowIndex to the data
            
          }],
          
        };
        localStorage.setItem('stepsData', JSON.stringify(updatedStepsData));
        return updatedStepsData;
      });
       // Clear context data after using the moveToLeadRow data
       clearMoveToLeadData();
    }
  }, [moveToLeadRow, clearMoveToLeadData]);

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
        <Step1
          stepName="Step1"
          cards={stepsData.Step1}  
          setStepsData={setStepsData}
        />
        <Step2 stepName="Step2" cards={stepsData.Step2} setStepsData={setStepsData} />
        <Step3 stepName="Step3" cards={stepsData.Step3} setStepsData={setStepsData} />
        <Step4 stepName="Step4" cards={stepsData.Step4} setStepsData={setStepsData} />
        <Step5 stepName="Step5" cards={stepsData.Step5} setStepsData={setStepsData} />
      </div>
    </DndProvider>
  );
};

export default Dashboard;
