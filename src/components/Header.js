import React from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";

import logo from "../logo.svg";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

const Header = ({ user, setUser }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {}
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {}
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img src={logo} className="App-logo" alt="logo" height="40px" />
          </Typography>
          {user ? (
            <>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleLogin}>
                Login With Google
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
