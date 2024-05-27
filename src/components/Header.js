import React from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";

import logo from "../logo.svg";
import login from "../login.png";
import logout from "../logout.png";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

const Header = ({ user, setUser }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log(result.user);
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
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <a href="/">
              <img src={logo} className="App-logo" alt="logo" height="40px" />
            </a>
          </Typography>
          {user ? (
            <>
              <Button color="inherit" onClick={handleLogout}>
                <img src={logout} className="logout" alt="logo" height="40px" />
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleLogin}>
                <img src={login} className="login" alt="logo" height="40px" />
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
