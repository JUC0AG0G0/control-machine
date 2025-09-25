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
import { Category, Menu as MenuIcon } from "@mui/icons-material";
import Sidebar from "./components/Sidebar";
import Background from "./pages/Background";
import Index from "./pages/Accueil/Accueil";
import Exemple from "./pages/Exemple";
import ListSounds from "./pages/Accueil/ListSounds";
import ListMachines from "./pages/Accueil/ListMachines";
import ListPictures from "./pages/Accueil/ListPictures";
import ListJavascript from "./pages/Accueil/ListJavascript";
import CategoryFilRouge from "./pages/Api-fil-rouge/CategoryFilRouge";

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
                  Menu
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

                {/* Element de base (module accueil) */}
                <Route path="/list-pictures" element={<ListPictures />} />
                <Route path="/list-machines" element={<ListMachines />} />
                <Route path="/list-sounds" element={<ListSounds />} />
                <Route path="/list-javascript" element={<ListJavascript />} />
                
                {/* Module api fil rouge */}
                <Route path="/api-fil-rouge/pokemon" element={<CategoryFilRouge theme="pokemon" api1="types" api2="pokemons" />} />
                <Route path="/api-fil-rouge/miyazaki" element={<CategoryFilRouge theme="miyasaki" api1="films" api2="heros" />} />
                <Route path="/api-fil-rouge/music" element={<CategoryFilRouge theme="music" api1="groupes" api2="albums" />} />
                <Route path="/api-fil-rouge/ocean" element={<CategoryFilRouge theme="ocean" api1="especes" api2="poissons" />} />
                <Route path="/api-fil-rouge/shop" element={<CategoryFilRouge theme="shop" api1="clients" api2="commandes" />} />
                <Route path="/api-fil-rouge/basketball" element={<CategoryFilRouge theme="basketball" api1="equipes" api2="joueurs" />} />
                <Route path="/api-fil-rouge/uha40" element={<CategoryFilRouge theme="UHA40" api1="annees" api2="certifications" />} />
                <Route path="/api-fil-rouge/browseshop" element={<CategoryFilRouge theme="browseShop" api1="categories" api2="produits" />} />
                <Route path="/api-fil-rouge/unix" element={<CategoryFilRouge theme="UNIX" api1="utilisateurs" api2="images" />} />
                <Route path="/api-fil-rouge/constructeurs" element={<CategoryFilRouge theme="car" api1="constructeurs" api2="voitures" />} />
                <Route path="/api-fil-rouge/arbres" element={<CategoryFilRouge theme="arbres" api1="types" api2="especes" />} />
                <Route path="/api-fil-rouge/livres" element={<CategoryFilRouge theme="livres" api1="auteurs" api2="livres" />} />



                {/* Module background */}
                <Route path="/background" element={<Background />} />
                
                <Route path="/exemple/*" element={<Exemple />} />
                <Route path="/exemple" element={<Exemple />} />
                <Route path="/settings/*" element={<div>Paramètres</div>} />
                
                {/* Base page d'accueil */}
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
