import React from "react";
import { AppBar, Box, Toolbar, Typography, Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import logo from "../logo.svg";

const Header = ({ onUploadClick }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img src={logo} className="App-logo" alt="logo" height="50px" />
          </Typography>
          <Fab size="small" variant="contained" onClick={onUploadClick}>
            <EditIcon />
          </Fab>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
