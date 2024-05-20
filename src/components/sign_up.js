import React, { useState } from "react";
import axios from "axios";
import { Stack, Typography, TextField, Button, Alert } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

const Sign_up = ({show}) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async () => {
    if (formData.name.trim() === '' || formData.email.trim() === '' || formData.password.trim() === '') {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/manual-sign_up", formData);
      console.log(response.data); 
      toast.success("Sign-up Successfull");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred during sign up.");
      toast.error(error.response?.data?.message || "An error occurred during sign up.");
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
          width: { xs: "90%", sm: "70%", md: "50%", lg: "30%" },
          backgroundColor: "#ffffff",
          boxShadow: 3,
          borderRadius: 2,
          padding: 4,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
          Sign Up
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <TextField
          type="text"
          value={formData.name}
          onChange={handleChange}
          id="name"
          label="Username"
          variant="outlined"
          fullWidth
          required
        />
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
          value={formData.password}
          onChange={handleChange}
          id="password"
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
          Back to{" "}
          <span
            style={{ color: "#1976d2", cursor: "pointer" }}
            onClick={() => {show(true)}}
          >
            Sign in
          </span>
        </Typography>
      </Stack>
      <Toaster/>
    </Stack>
  );
};

export default Sign_up;
