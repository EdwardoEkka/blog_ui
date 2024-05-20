import React, { useEffect,useState } from "react";
import { Stack,Container,Typography,Button} from "@mui/material";
import Sign_in from "./sign_in";
import Sign_up from "./sign_up";
import axios from "axios";
import { getToken } from "./tokenService";
import { removeToken } from "./tokenService";
import { useUserContext } from "../userContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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


const Main_log = () => {
  const { user, updateUser } = useUserContext();
  const [log,setLog]=useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const show=(data)=>{
    setLog(data);
  }

  const fetchUserDetails = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get(`${apiUrl}/user-details`, {
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
    console.log(user.userId);
  }, []);



  return (
    <Stack>
      {user.userId !== "" ? (
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
            }}
          >
            Logout
          </Button>
        </Container>
      </ThemeProvider>
      ) 
      : 
      (
        <Stack direction={{ xs: "column", sm: "row" }}>
          <Stack
            sx={{ height: "100vh", width: "100vw", backgroundColor: "blue" }}
          >
            {
              log?(
                <Sign_in show={show}/>
              ):
              (
                <Sign_up show={show}/>
              )
            }
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default Main_log;
