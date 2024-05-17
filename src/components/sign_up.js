import React, { useState } from "react";
import axios from "axios";
import { Stack, Typography, TextField, Button } from "@mui/material";

const Sign_up = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/manual-sign_up", formData);
      console.log(response.data); 
    } catch (error) {
      console.error(error);
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
          alignItems: "center"
        }}
      >
        <Typography variant="p" sx={{ fontSize: { xs: "30px", sm: "48px" }, mb: "10px" }}>
          Sign Up
        </Typography>
        <TextField
          type="text"
          defaultValue=""
          id="name"
          label="Username"
          sx={{ marginBottom: "10px", width: "90%" }}
          onChange={handleChange}
        />
        <TextField
          type="text"
          defaultValue=""
          id="email"
          label="Email"
          sx={{ marginBottom: "10px", width: "90%" }}
          onChange={handleChange}
        />
        <TextField
          type="password"
          defaultValue=""
          id="password"
          label="Password"
          sx={{ marginBottom: "10px", width: "90%" }}
          onChange={handleChange}
        />
        <Button variant="text" sx={{ backgroundColor: "green", color: "white", mb: "10px" }} onClick={handleSubmit}>
          Submit
        </Button>
        <Stack>
          <p>
            Back to{" "}
            <span
              style={{ color: "green", cursor: "pointer" }}
              onClick={() => {
                // Handle navigation to sign in
              }}
            >
              Sign in
            </span>
          </p>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Sign_up;
