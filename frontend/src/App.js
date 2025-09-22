import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Sidebar from "./components/Sidebar";
import Background from "./pages/Background";
import Index from "./pages/Index";
import Exemple from "./pages/Exemple";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <Box className="flex h-screen bg-gray-100">
        <Sidebar
          isOpen={isMobile ? sidebarOpen : true}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />

        <Box className="flex-1 flex flex-col overflow-hidden">
          {isMobile && (
            <AppBar
              position="static"
              className="bg-white shadow-sm"
              elevation={1}
            >
              <Toolbar className="bg-white">
                <IconButton
                  edge="start"
                  onClick={toggleSidebar}
                  className="text-gray-600 hover:text-gray-900 mr-2"
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  className="text-gray-900 font-semibold"
                >
                  Mon App
                </Typography>
              </Toolbar>
            </AppBar>
          )}

          <Box
            component="main"
            className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100"
            sx={{
              marginLeft: !isMobile ? 0 : 0,
              transition: theme.transitions.create(["margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }}
          >
            <Box className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/background" element={<Background />} />
                <Route path="/exemple/*" element={<Exemple />} />
                <Route path="/exemple" element={<Exemple />} />
                <Route path="/settings/*" element={<div>Paramètres</div>} />
                <Route path="/*" element={<Index />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
