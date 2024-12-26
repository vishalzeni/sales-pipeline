import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import DatasetIcon from "@mui/icons-material/Storage";
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BarChartIcon from '@mui/icons-material/BarChart';

const Sidebar = ({ open, toggleSidebar, setActiveContent, activeContent }) => {
  const handleClick = (content) => {
    setActiveContent(content);
  };

  return (
    <Drawer
      variant="persistent"
      open={open}
      anchor="left"
      sx={{
        "& .MuiDrawer-paper": {
          width: "240px",
          boxSizing: "border-box",
          position: "fixed",
          top: "64px",
          height: "calc(100% - 64px)",
          backgroundColor: "#fff",
          zIndex: 1200,
        },
        "@media (max-width: 600px)": {
          width: "100%",
          position: "absolute",
        },
      }}
    >
      {/* Exit Button */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "#9C27B0",
        }}
      >
        <ExitToAppIcon />
      </IconButton>

      {/* Links List */}
      <List sx={{ marginTop: "40px" }}>
        {/* Home Link */}
        <ListItem
          onClick={() => handleClick("home")}
          sx={{
            backgroundColor:
              activeContent === "home" ? "#9C27B0" : "transparent",
            color: activeContent === "home" ? "#FFFFFF" : "#9C27B0",
            "&:hover": {
              backgroundColor: "#9C27B0",
              color: "#FFFFFF",
            },
            cursor: "pointer",
            paddingLeft: "16px",
            "&:hover .MuiSvgIcon-root": {
              color: "#FFFFFF",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: activeContent === "home" ? "#FFFFFF" : "#9C27B0",
              minWidth: "40px",
            }}
          >
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" sx={{ marginLeft: "-10px" }} />
        </ListItem>

        {/* Datasets Link */}
        <ListItem
          onClick={() => handleClick("datasets")}
          sx={{
            backgroundColor:
              activeContent === "datasets" ? "#9C27B0" : "transparent",
            color: activeContent === "datasets" ? "#FFFFFF" : "#9C27B0",
            "&:hover": {
              backgroundColor: "#9C27B0",
              color: "#FFFFFF",
            },
            cursor: "pointer",
            paddingLeft: "16px",
            "&:hover .MuiSvgIcon-root": {
              color: "#FFFFFF",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: activeContent === "datasets" ? "#FFFFFF" : "#9C27B0",
              minWidth: "40px",
            }}
          >
            <DatasetIcon />
          </ListItemIcon>
          <ListItemText primary="Datasets" sx={{ marginLeft: "-10px" }} />
        </ListItem>

        {/* Dashboard Link */}
        <ListItem
          onClick={() => handleClick("dashboard")}
          sx={{
            backgroundColor:
              activeContent === "dashboard" ? "#9C27B0" : "transparent",
            color: activeContent === "dashboard" ? "#FFFFFF" : "#9C27B0",
            "&:hover": {
              backgroundColor: "#9C27B0",
              color: "#FFFFFF",
            },
            cursor: "pointer",
            paddingLeft: "16px",
            "&:hover .MuiSvgIcon-root": {
              color: "#FFFFFF",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: activeContent === "dashboard" ? "#FFFFFF" : "#9C27B0",
              minWidth: "40px",
            }}
          >
                        <DashboardIcon />

          </ListItemIcon>
          <ListItemText primary="Dashboard" sx={{ marginLeft: "-10px" }} />
        </ListItem>

         {/* Sales Link */}
         <ListItem
          onClick={() => handleClick("sales")}
          sx={{
            backgroundColor:
              activeContent === "sales" ? "#9C27B0" : "transparent",
            color: activeContent === "sales" ? "#FFFFFF" : "#9C27B0",
            "&:hover": {
              backgroundColor: "#9C27B0",
              color: "#FFFFFF",
            },
            cursor: "pointer",
            paddingLeft: "16px",
            "&:hover .MuiSvgIcon-root": {
              color: "#FFFFFF",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: activeContent === "sales" ? "#FFFFFF" : "#9C27B0",
              minWidth: "40px",
            }}
          >
            <AutoGraphIcon />
          </ListItemIcon>
          <ListItemText primary="Sales" sx={{ marginLeft: "-10px" }} />
        </ListItem>

        {/* Stats Link */}
        <ListItem
          onClick={() => handleClick("statistics")}
          sx={{
            backgroundColor:
              activeContent === "statistics" ? "#9C27B0" : "transparent",
            color: activeContent === "statistics" ? "#FFFFFF" : "#9C27B0",
            "&:hover": {
              backgroundColor: "#9C27B0",
              color: "#FFFFFF",
            },
            cursor: "pointer",
            paddingLeft: "16px",
            "&:hover .MuiSvgIcon-root": {
              color: "#FFFFFF",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: activeContent === "statistics" ? "#FFFFFF" : "#9C27B0",
              minWidth: "40px",
            }}
          >
                        <BarChartIcon />

          </ListItemIcon>
          <ListItemText primary="Statistics" sx={{ marginLeft: "-10px" }} />
        </ListItem>

        {/* Settings Link */}
        <ListItem
          onClick={() => handleClick("settings")}
          sx={{
            backgroundColor:
              activeContent === "settings" ? "#9C27B0" : "transparent",
            color: activeContent === "settings" ? "#FFFFFF" : "#9C27B0",
            "&:hover": {
              backgroundColor: "#9C27B0",
              color: "#FFFFFF",
            },
            cursor: "pointer",
            paddingLeft: "16px",
            "&:hover .MuiSvgIcon-root": {
              color: "#FFFFFF",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: activeContent === "settings" ? "#FFFFFF" : "#9C27B0",
              minWidth: "40px",
            }}
          >
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" sx={{ marginLeft: "-10px" }} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
