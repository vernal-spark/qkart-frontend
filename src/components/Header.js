import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Box, Button, Stack } from "@mui/material";
import React from "react";
import {
  useHistory,
  useState,
  useEffect,
  withRouter,
  useSnackbar,
} from "react-router-dom";
import { Link } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons, setToken }) => {
  let history = useHistory();

  // const theme=createTheme({
  //   palette:{
  //     crio:{
  //       main:'#00a278'
  //     }
  //   }
  // })
  // return (
  //   <Box className="header">
  //     <Box className="header-title">
  //       <Link to="/">
  //         <img src="logo_light.svg" alt="QKart-icon"></img>
  //       </Link>
  //     </Box>
  //     {children}
  //     {{hasHiddenAuthButtons}?(
  //       <Button
  //       className="explore-button"
  //       startIcon={<ArrowBackIcon />}
  //       variant="text"
  //       onClick={()=>{history.push("/")}}>
  //       Back to explore
  //       </Button>
  //       ):
  //       (
  //         <Stack direction="row" spacing={1} align-item="center">
  //         {localStorage.getItem("username")}?(
  //           <Avatar src="avatar.png" alt={localStorage.getItem("username")||"profile"}/>
  //           <p className="usename-text">{localStorage.getItem("usename")}</p>
  //           <Button color="crio" onClick={()=>{history.push("/login")}}>
  //             Logout
  //           </Button>
  //         ):(
  //           <Button color="crio" onClick={()=>{history.push("/login")}}>
  //             Login
  //           </Button>
  //           <Button variant="contained" color="crio" onClick={()=>{history.push("/login")}}>
  //             Register
  //           </Button>
  //         )
  //         </Stack>
  //       )
  //     }

  //   </Box>
  // );

  if (hasHiddenAuthButtons) {
    return (
      <Box className="header">
        <Box className="header-title">
          <Link to="/">
            <img src="logo_light.svg" alt="QKart-icon"></img>
          </Link>
        </Box>
        {children}
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            history.push("/");
          }}
        >
          Back to explore
        </Button>
      </Box>
    );
  }
  return (
    <Box className="header">
      <Box className="header-title">
        <Link to="/">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Link>
      </Box>
      {children}
      <Stack direction="row" spacing={1} align-item="center">
        {localStorage.getItem("username") ? (
          <>
            <Avatar
              src="avatar.png"
              alt={localStorage.getItem("username") || "profile"}
            />
            <p className="username-text">{localStorage.getItem("username")}</p>
            <Button
              onClick={() => {
                localStorage.removeItem("username");
                localStorage.removeItem("token");
                localStorage.removeItem("balance");
                setToken();
                history.push("/");
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              color="primary"
              onClick={() => {
                history.push("/login");
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => history.push("/register")}
            >
              Register
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default withRouter(Header);
