import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const containerStyle = {
  marginTop: '2rem',
  textAlign: 'center',
};

const titleStyle = {
  marginBottom: '1.5rem',
};

const buttonStyle = {
  marginTop: '1.5rem',
};

const LoginStatus = () => {
  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
  };

  return (
    <Container maxWidth="sm" style={containerStyle}>
      <Typography variant="h4" style={titleStyle} gutterBottom>
        You are already logged in
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogout}
        style={buttonStyle}
      >
        Click here to logout
      </Button>
    </Container>
  );
};

export default LoginStatus;
