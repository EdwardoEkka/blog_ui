import React, { useEffect, useState } from "react";
import { TextField, Typography, Paper, Container, Button } from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { getToken } from "./tokenService";
import { useUserContext } from "../userContext";

const Read = () => {
  const location = useLocation();
  const receivedId = location.state?.blog_id;
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [writer, setWriter] = useState("");
  const [comment, setComment] = useState("");
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
  }, []);

  useEffect(() => {
    async function fetchBlogData() {
      try {
        const response = await axios.get(
          `http://localhost:5000/getTheBlog/${receivedId}`
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch blog data");
        }
        const data = response.data;
        setWriter(data.name);
        setTitle(data.title);
        setContent(data.body);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBlogData();
  }, [receivedId]);

  const PostLike = async (blogId) => {
    try {
      const response = await axios.post("http://localhost:5000/postlike", {
        blogId: blogId,
        likerName: user?.username,
        likerId: user?.userId,
      });
      console.log("Like submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const PostComment = async (blogId) => {
    try {
      console.log(blogId);
      const response = await axios.post("http://localhost:5000/postComment", {
        blogId: blogId,
        comment: comment,
        commenterName: user?.username,
        commenterId: user?.userId,
      });
      console.log("Post submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          By {writer}
        </Typography>
        <Typography variant="body1" paragraph>
          {content}
        </Typography>
        <Button
          variant="standard"
          onClick={() => {
            PostLike(receivedId);
          }}
        >
          Like
        </Button>
      </Paper>
      <TextField
        id="comment"
        multiline
        variant="outlined"
        value={comment}
        rows={2}
        onChange={handleCommentChange}
      />
      <Button variant="standard" onClick={()=>{PostComment(receivedId)}}>Submit</Button>
    </Container>
  );
};

export default Read;
