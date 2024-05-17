import { Stack, Typography, Card, CardMedia, Container } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate } from 'react-router-dom';
import { getToken } from "./tokenService";
import { useUserContext } from '../userContext';
import Hero from "./hero";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
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
      const data=response.data;
      updateUser(data.email, data.name, data._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Fetch blogs from the server
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getPubBlogs");
        console.log("Blogs fetched successfully:", response.data);
        setBlogs(response.data);
      } catch (error) {
        console.error("Error getting blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  // Fetch random picture for each blog
  useEffect(() => {
    const fetchRandomPicture = async (title, index) => {
      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(
            title
          )}&per_page=1&page=${Math.floor(Math.random() * 100) + 1}`,
          {
            headers: {
              Authorization: "eVdUHdmsN1kGXmocqmyGx4Yh2uiH2SSwzcDNCOKirUvUuNtIOa886BZR",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch picture");
        }
        const data = await response.json();
        const imageUrl = data.photos[0].src.large;
        setBlogs(prevBlogs => {
          const updatedBlogs = [...prevBlogs];
          updatedBlogs[index].imageUrl = imageUrl;
          return updatedBlogs;
        });
      } catch (error) {
        console.error(error);
      }
    };

    blogs.forEach((blog, index) => {
      if (!blog.imageUrl) {
        fetchRandomPicture(blog.title, index);
      }
    });
  }, [blogs]);

  // Format date function
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString(undefined, options);
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);
    return `${formattedDate}, ${formattedTime}`;
  };

  return (
    <div>
      <Hero/>
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={2}
      justifyContent="center"
      alignItems="flex-start"
    >
      {blogs.map((blog, index) => (
        <Card key={index} sx={{ width: 300, maxWidth: '100%', margin: 2 }} onClick={()=>{navigate("/read", { state: {blog_id: blog._id} })}}>
          <CardMedia
            component="img"
            height="200"
            image={blog.imageUrl || '/img.png'}
            alt={blog.title}
            style={{ objectFit: 'cover' }}
          />
          <div style={{ padding: '1rem' }}>
            <Typography variant="h6" gutterBottom>
              {blog.title.length > 25 ? `${blog.title.substring(0, 25)}...` : blog.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {formatDate(blog.date)}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{display:"flex",justifyContent:"flex-end"}}>
              by {blog.name}
            </Typography>
          </div>
        </Card>
      ))}
    </Stack>
    </div>
  );
};

export default Home;
