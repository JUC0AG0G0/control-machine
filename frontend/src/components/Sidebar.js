import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    IconButton,
    Typography,
    Box,
} from "@mui/material";
import {
    Home as HomeIcon,
    Code as CodeIcon,
    Palette as PaletteIcon,
    ExpandLess,
    ExpandMore,
    Close as CloseIcon,
} from "@mui/icons-material";

const DRAWER_WIDTH = 280;

function Sidebar({ isOpen, toggleSidebar, isMobile }) {
    const [expandedCategories, setExpandedCategories] = useState({});
    const location = useLocation();

    const toggleCategory = (categoryKey) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryKey]: !prev[categoryKey],
        }));
    };

    const menuItems = [
        {
            key: "home",
            title: "Accueil",
            path: "/",
            icon: <HomeIcon />,
            children: [
                { title: "Liste des machines", path: "/list-machines" },
                { title: "Liste des sons", path: "/list-sounds" },
                { title: "Liste des images", path: "/list-pictures" },
                { title: "Liste des scripts javascript", path: "/list-javascript" },
            ],
        },
        {
            key: "Api-fil-rouge",
            title: "API Fil Rouge",
            path: "/api-fil-rouge",
            icon: <CodeIcon />,
            children: [
                { title: "Pokemon", path: "/api-fil-rouge/pokemon" },
                { title: "Miyazaki", path: "/api-fil-rouge/miyazaki" },
                { title: "Music", path: "/api-fil-rouge/music" },
                { title: "Ocean", path: "/api-fil-rouge/ocean" },
                { title: "Shop", path: "/api-fil-rouge/shop" },
                { title: "BasketBall", path: "/api-fil-rouge/basketball" },
                { title: "UHA40", path: "/api-fil-rouge/uha40" },
                { title: "BrowseShop", path: "/api-fil-rouge/browseshop" },
                { title: "UNIX", path: "/api-fil-rouge/unix" },
                { title: "Constructeurs", path: "/api-fil-rouge/constructeurs" },
                { title: "Arbres", path: "/api-fil-rouge/arbres" },
                { title: "Livres", path: "/api-fil-rouge/livres" },
            ],
        },
        {
            key: "examples",
            title: "Exemples",
            path: "/exemple",
            icon: <CodeIcon />,
            children: [
                { title: "Exemple 1", path: "/exemple/1" },
                { title: "Exemple 2", path: "/exemple/2" },
                { title: "Exemple 3", path: "/exemple/3" },
            ],
        },
        {
            key: "background",
            title: "Background",
            path: "/background",
            icon: <PaletteIcon />,
        },
    ];

    const isActiveLink = (path) => {
        return (
            location.pathname === path ||
            (path !== "/" && location.pathname.startsWith(path))
        );
    };

    const drawerContent = (
        <Box className="h-full bg-gray-900 text-white flex flex-col justify-between">
            <Box>
                <Box className="flex items-center justify-between p-4 border-b border-gray-700">
                    <Typography variant="h6" className="text-white font-bold">
                        💻 Control Machine
                    </Typography>
                    {isMobile && (
                        <IconButton
                            onClick={toggleSidebar}
                            className="text-gray-400 hover:text-white"
                            size="normal"
                        >
                            <CloseIcon />
                        </IconButton>
                    )}
                </Box>

                <List className="flex-1 overflow-y-auto p-2">
                    {menuItems.map((item) => (
                        <React.Fragment key={item.key}>
                            <ListItem disablePadding>
                                <Box className="w-full flex items-center">
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        onClick={() => {
                                            if (isMobile) toggleSidebar();
                                        }}
                                        className={`
                      flex-1 rounded-lg mx-1 transition-all duration-200
                      ${isActiveLink(item.path)
                                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                            }
                    `}
                                    >
                                        <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.title}
                                            primaryTypographyProps={{
                                                fontSize: "1rem",
                                                fontWeight: 500,
                                            }}
                                        />
                                    </ListItemButton>

                                    {item.children && (
                                        <IconButton
                                            onClick={() => toggleCategory(item.key)}
                                            className="text-gray-400 hover:text-white mr-2"
                                            size="normal"
                                        >
                                            {expandedCategories[item.key] ? (
                                                <ExpandLess sx={{ color: "white" }} />
                                            ) : (
                                                <ExpandMore sx={{ color: "white" }} />
                                            )}
                                        </IconButton>
                                    )}
                                </Box>
                            </ListItem>

                            {item.children && (
                                <Collapse
                                    in={expandedCategories[item.key]}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <List component="div" disablePadding>
                                        {item.children.map((child, index) => (
                                            <ListItem key={index} disablePadding>
                                                <ListItemButton
                                                    component={Link}
                                                    to={child.path}
                                                    onClick={() => {
                                                        if (isMobile) toggleSidebar();
                                                    }}
                                                    className={`
                            ml-8 rounded-lg mx-1 transition-all duration-200
                            ${isActiveLink(child.path)
                                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                                        }
                          `}
                                                >
                                                    <ListItemText
                                                        primary={child.title}
                                                        primaryTypographyProps={{
                                                            fontSize: "0.95rem",
                                                        }}
                                                        className="ml-6"
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Box>

            <Box className="p-4 border-t border-gray-700">
                <Typography
                    variant="caption"
                    className="text-gray-500 text-center block"
                >
                    Version 1.0.0
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isOpen}
            onClose={toggleSidebar}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: DRAWER_WIDTH,
                    boxSizing: "border-box",
                    border: "none",
                },
            }}
        >
            {drawerContent}
        </Drawer>
    );
}

export default Sidebar;
