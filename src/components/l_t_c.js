import React from 'react';
import { Box, Typography, Button, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PleaseLogin = ({word}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate=useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f5f5f5"
      p={isSmallScreen ? 2 : 3}
      textAlign={isSmallScreen ? 'center' : 'left'}
    >
      <Typography variant={isSmallScreen ? 'h5' : 'h4'} gutterBottom>
        Please login to {word}
      </Typography>
      <Button variant="contained" color="primary" onClick={()=>{navigate('/main_log')}}>
        Go to login
      </Button>
    </Box>
  );
};

export default PleaseLogin;
