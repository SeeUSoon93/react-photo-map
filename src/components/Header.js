import React, { useRef } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  InputBase,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

import logo from "../logo.svg";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

const Header = ({ user, setUser, setSearchQuery }) => {
  const searchInputRef = useRef("");

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

  const handleSearchChange = (e) => {
    searchInputRef.current = e.target.value;
  };
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      let searchValue = searchInputRef.current;
      console.log(searchValue);
      setSearchQuery(searchValue);
      searchInputRef.current = "";
    }
  };

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar position="static">
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <a href="/">
              <img src={logo} className="App-logo" alt="logo" height="40px" />
            </a>
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="지역으로 검색"
              inputProps={{ "aria-label": "search" }}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
            />
          </Search>
          {user ? (
            <>
              <Button color="info" onClick={handleLogout} variant="contained">
                LOGOUT
              </Button>
            </>
          ) : (
            <>
              <Button color="info" onClick={handleLogin} variant="contained">
                LOGIN
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
