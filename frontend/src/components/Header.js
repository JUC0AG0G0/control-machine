import React, { useState } from "react";
import Typography from '@mui/material/Typography';

function Header({ title, description }) {
    return (
        <header className="relative top-8">
            <Typography variant="h3">{title}</Typography>
            <Typography className="pt-5">{description}</Typography>
        </header>
    );
}

export default Header;
