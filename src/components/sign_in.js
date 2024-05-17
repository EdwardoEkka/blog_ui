import React, { useState } from "react";
import { Stack, Typography, TextField, Button } from "@mui/material";
import { setToken } from "./tokenService";
import axios from "axios";
import { useUserContext } from '../userContext';
import { useNavigate } from 'react-router-dom';

const Sign_in = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate=useNavigate();

  const { user, updateUser } = useUserContext();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async () => {
    console.log(formData);
    if (formData.email.trim() === '' || formData.password.trim() === '') {
      console.log("Please fill in all fields.");
      return; // Exit early if any field is empty
    }

    try {
      // Make POST request to backend API endpoint
      const response = await axios.post(
        "http://localhost:5000/manual-sign_in",
        formData
      );
      const { token } = response.data;
      setToken(token);
      console.log("Sign In Successfully");
      console.log("Sign-in successful:", response.data);
      const data=response.data.user;
      console.log(data);
      updateUser(data.email, data.name, data.id);
      navigate('/');
      // Optionally, you can redirect the user or show a success message
    } catch (error) {
      console.error("Error signing in:", error);
      console.log(error.response.data.message);
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <Stack sx={{ alignItems: "center", justifyContent: "center" }}>
      <Stack
        sx={{
          width: { sm: "90%", md: "50%", xs: "70%" },
          backgroundColor: "yellow",
          mt: 10,
          pt: 3,
          alignItems: "center",
        }}
      >
        <Typography variant="p" sx={{ fontSize: { xs: "30px", sm: "48px"}, mb: "10px"}}>
          Sign In
        </Typography>
        <TextField
          type="text"
          defaultValue=""
          onChange={handleChange}
          name="email"
          id="email" 
          label="Email"
          sx={{ marginBottom: "10px", width: "90%" }}
        />
        <TextField
          type="password"
          id="password"
          defaultValue=""
          onChange={handleChange}
          name="password" // Changed id to name for consistency with formData keys
          label="Password"
          sx={{ marginBottom: "10px", width: "90%" }}
        />
        <Button variant="text" sx={{ backgroundColor: "green", color: "white", mb: "10px" }} onClick={handleSubmit}>
          Submit
        </Button>
        <Stack>
          <p>
            No account?{" "}
            <span
              style={{ color: "green", cursor: "pointer" }}
              onClick={() => {
                // Handle navigation to sign up
              }}
            >
              Sign up
            </span>
          </p>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Sign_in;
