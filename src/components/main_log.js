import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import Sign_in from "./sign_in";
import Sign_up from "./sign_up";
import axios from "axios";
import { getToken } from "./tokenService";
import { useUserContext } from "../userContext";

const Main_log = () => {
  const { user, updateUser } = useUserContext();
  const fetchUserDetails = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get("http://localhost:5000/user-details", {
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
        <Stack sx={{justifyContent:"center",alignItems:"center"}}>You are Already Logged In</Stack>
      ) 
      : 
      (
        <Stack direction={{ xs: "column", sm: "row" }}>
          <Stack
            sx={{
              height: "100vh",
              width: "100vw",
              backgroundColor: "green",
              display: { xs: "none", sm: "block" },
            }}
          ></Stack>
          <Stack
            sx={{ height: "100vh", width: "100vw", backgroundColor: "blue" }}
          >
            <Sign_in />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default Main_log;
