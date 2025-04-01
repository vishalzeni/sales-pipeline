import React, { useState } from "react";
import { Box } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sidebar from "../components/Sidebar";
import Dashboard from "./content/Dashboard";
import Settings from "./content/Settings";
import Statistics from "./content/Statistics";
import Home from "./content/Home";
import DataSets from "./content/DataSets";
import Sales from "./content/Sales";

const ContentArea = ({ openSidebar, toggleSidebar }) => {
  const [activeContent, setActiveContent] = useState("home");
  const [uploadedData, setUploadedData] = useState(null);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          open={openSidebar}
          toggleSidebar={toggleSidebar}
          setActiveContent={setActiveContent}
          activeContent={activeContent} // Pass the activeContent state here
        />

        <Box
          sx={{
            flexGrow: 1,
            padding: 0,
            backgroundColor: "#f4f4f4",
            marginLeft: openSidebar ? "240px" : "0",
            transition: "margin-left 0.3s ease",
            overflow: "auto", // Apply auto scroll
            maxHeight: "100vh", // Make sure it scrolls vertically within the full screen
          }}
        >
            {activeContent === "home" && <Home setUploadedData={setUploadedData} />}
            {activeContent === "datasets" && <DataSets data={uploadedData} />}
            {activeContent === "dashboard" && <Dashboard />}
            {activeContent === "sales" && <Sales />}
            {activeContent === "settings" && <Settings />}
            {activeContent === "statistics" && <Statistics />}
        </Box>
      </div>
    </DndProvider>
  );
};

export default ContentArea;
