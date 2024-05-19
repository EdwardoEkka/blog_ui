import { Container, Typography, Button } from '@mui/material';
import React, {useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "./tokenService";
import { useUserContext } from "../userContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { removeToken } from "./tokenService";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
  typography: {
    h5: {
      fontWeight: 600,
    },
    body1: {
      marginBottom: '1rem',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          marginTop: '2rem',
          textAlign: 'center',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          marginTop: '1.5rem',
        },
      },
    },
  },
});

const LoginStatus = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUserContext();

  const fetchUserDetails = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get("http://localhost:5000/user-details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      updateUser(data.email, data.name, data._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  },);
 
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Typography variant="h5" gutterBottom>
          Welcome, {user.username}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {user.email}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            removeToken();
            updateUser("", "", "");
            // navigate('/');
          }}
        >
          Logout
        </Button>
      </Container>
    </ThemeProvider>
  );
};

export default LoginStatus;
