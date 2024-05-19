import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Stack, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../userContext";
import { removeToken } from "./tokenService";

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function HideAppBar(props) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const { user, updateUser } = useUserContext();

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const list = (
    <Box
    sx={{ 
      width: 250, 
      bgcolor: 'background.paper',

    }}
    role="presentation"
    onClick={toggleDrawer}
    onKeyDown={toggleDrawer}
  >
    <Stack 
      direction="row" 
      alignItems="center" 
      sx={{ 
        backgroundColor: 'primary.main', 
        p: 2, 
        color: 'primary.contrastText' 
      }}
    >
      <Stack>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {user.userId === "" ? (
            <Stack
              onClick={() => navigate("/main_log")}
              sx={{ cursor: "pointer" }}
            >
              Click to Log in
            </Stack>
          ) : (
            "Hello, " + user.username
          )}
        </Typography>
        {user.userId !== "" && <Typography variant="body2">{user.email}</Typography>}
      </Stack>
    </Stack>
    <List>
      <ListItem 
        button 
        sx={{ 
          '&:hover': { backgroundColor: 'primary.light' },
          p: 2 
        }} 
        onClick={() => navigate("/")}
      >
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem 
        button 
        sx={{ 
          '&:hover': { backgroundColor: 'primary.light' },
          p: 2 
        }} 
        onClick={() => navigate("/view")}
      >
        <ListItemText primary="Profile" />
      </ListItem>
      <ListItem 
        button 
        sx={{ 
          '&:hover': { backgroundColor: 'primary.light' },
          p: 2 
        }} 
        onClick={() => navigate("/write")}
      >
        <ListItemText primary="Write" />
      </ListItem>
      <ListItem 
        button 
        sx={{ 
          '&:hover': { backgroundColor: 'primary.light' },
          p: 2 
        }} 
        onClick={() => navigate("/main_log")}
      >
        <ListItemText primary="About" />
      </ListItem>
      {user.userId !== "" && (
        <ListItem
          button
          sx={{ 
            '&:hover': { backgroundColor: 'primary.light' },
            p: 2 
          }}
          onClick={() => {
            removeToken();
            updateUser("", "", "");
          }}
        >
          <ListItemText primary="Logout" />
        </ListItem>
      )}
    </List>
  </Box>
  );
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar sx={{ backgroundColor: "#1976d2" }}>
          <Toolbar>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1, color: "#fff" }}
                >
                  Brand
                </Typography>
              </Grid>
              <Grid item>
                {isMobile ? (
                  <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer}
                    sx={{ color: "#fff" }}
                  >
                    <MenuIcon />
                  </IconButton>
                ) : (
                  <Box
                    component="ul"
                    display="flex"
                    flexDirection="row"
                    gap={2}
                    m={0}
                    p={0}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: "#fff", cursor: "pointer" }}
                      onClick={() => {
                        navigate("/");
                      }}
                    >
                      Home
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#fff", cursor: "pointer" }}
                      onClick={() => {
                        navigate("/view");
                      }}
                    >
                      Profile
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#fff", cursor: "pointer" }}
                      onClick={() => {
                        navigate("/write");
                      }}
                    >
                      Write
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#fff", cursor: "pointer" }}
                      onClick={() => {
                        navigate("/main_log");
                      }}
                    >
                      About
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
        {list}
      </Drawer>
    </React.Fragment>
  );
}
