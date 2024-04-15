import React, { useState } from "react";
import axios from "axios"; // Import Axios
import "./styles/sign_in.css"; // Importing CSS file for styling
import { setToken } from "./tokenService";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { useUser } from './userContext';
import {useNavigate } from 'react-router-dom';

const SignIn = ({Show}) => {
  const { updateUser } = useUser();
 const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State to track password visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make POST request to backend API endpoint
      const response = await axios.post(
        "http://localhost:5000/manual-sign_in",
        formData
      );
      const { token } = response.data;
      setToken(token);
      fetchUserDetails(token);
      navigate('/users');
    } catch (error) {
      console.error("Error signing in:", error);
      // Optionally, you can show an error message to the user
    }
  };

  const fetchUserDetails = async (token) => {
    try {
      if (!token) {
        throw new Error("Token not found");
      }
  
      const response = await axios.get("http://localhost:5000/user-details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // updateUser(response.data.user);
      console.log(response.data);
      updateUser(response.data.name, response.data.id);
      // setUserDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="sign-in-container">
      <h2 className="sign-in-heading">Sign In</h2>
      <form className="sign-in-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>

          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
          />
          <div className="password-toggle" onClick={togglePasswordVisibility}>
            {showPassword ? <BiSolidHide /> : <BiSolidShow />}
          </div>
        </div>
        <button type="submit" className="btn sign-up-btn">
          Sign in
        </button>
      </form>
      <div className="sign-up-redirect">
        <p>
          No account?{" "}
          <span
            style={{ color: "green", cursor: "pointer" }}
            onClick={() => {Show();
            }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
