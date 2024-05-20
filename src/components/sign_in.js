import React, { useState } from "react";
import { Stack, Typography, TextField, Button, Alert } from "@mui/material";
import { setToken } from "./tokenService";
import axios from "axios";
import { useUserContext } from '../userContext';
import { useNavigate } from 'react-router-dom';

const Sign_in = ({show}) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useUserContext();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async () => {
    if (formData.email.trim() === '' || formData.password.trim() === '') {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    
    try {
      const response = await axios.post("http://localhost:5000/manual-sign_in", formData);
      const { token, user } = response.data;

      setToken(token);
      updateUser(user.email, user.name, user.id);
      navigate('/');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred during sign in.");
    }
  };

  return (
    <Stack
      sx={{
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: 3,
      }}
    >
      <Stack
        spacing={2}
        sx={{
          width:{ xs: "90%", sm: "70%", md: "50%", lg: "30%" },
          backgroundColor: "#ffffff",
          boxShadow: 3,
          borderRadius: 2,
          padding: 4,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
          Sign In
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <TextField
          type="email"
          value={formData.email}
          onChange={handleChange}
          id="email"
          label="Email"
          variant="outlined"
          fullWidth
          required
        />
        <TextField
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          label="Password"
          variant="outlined"
          fullWidth
          required
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          fullWidth
        >
          Submit
        </Button>
        <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
          No account?{" "}
          <span
            style={{ color: "#1976d2", cursor: "pointer" }}
            onClick={() => {show(false)}}
          >
            Sign up
          </span>
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Sign_in;
