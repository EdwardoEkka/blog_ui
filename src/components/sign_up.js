import React, { useState } from "react";
import axios from "axios"; // Import Axios
import "./styles/sign_up.css"; // Importing CSS file for styling
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";


const SignUp = ({Show}) => {
  const [formData, setFormData] = useState({
    name: "",
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
        "http://localhost:5000/manual-sign_up",
        formData
      );
      console.log("Sign-up successful:", response.data);
      // Optionally, you can redirect the user or show a success message
    } catch (error) {
      console.error("Error signing up:", error);
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <div className="sign-up-container">
        <div style={{position:"absolute",right:"0px",top:"0",padding:"5px"}}>
            <RxCross1 onClick={()=>{Show();}}/>
        </div>
      <h2 className="sign-up-heading">Sign Up</h2>
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>
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
          <div className="password-toggle-up" onClick={togglePasswordVisibility}>
            {showPassword ? <BiSolidHide /> : <BiSolidShow />}
          </div>
        </div>
        <button type="submit" className="btn sign-up-btn">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
