import React, { useEffect, useState } from "react";
import {
  TextField,
  Typography,
  Paper,
  Container,
  Button,
  Grid,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Stack,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { getToken } from "./tokenService";
import { useUserContext } from "../userContext";

const Read = () => {
  const location = useLocation();
  const receivedId = location.state?.blog_id;
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [likes, setLikes] = useState(0);
  const [writer, setWriter] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
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
      setTags(data.tags);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchLikes() {
    try {
      const response = await axios.get(
        `http://localhost:5000/getLikes/${receivedId}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch likes data");
      }
      setLikes(response.data.length);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchComments() {
    try {
      const response = await axios.get(
        `http://localhost:5000/getComments/${receivedId}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch comments data");
      }
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchBlogData();
    fetchLikes();
    fetchComments();
  }, [receivedId]);

  const PostLike = async (blogId) => {
    try {
      const response = await axios.post("http://localhost:5000/postlike", {
        blogId: blogId,
        likerName: user?.username,
        likerId: user?.userId,
      });
      console.log("Like submitted successfully:", response.data);
      fetchLikes();
    } catch (error) {
      console.error("Error submitting like:", error);
    }
  };

  const PostComment = async (blogId) => {
    try {
      const response = await axios.post("http://localhost:5000/postComment", {
        blogId: blogId,
        comment: comment,
        commenterName: user?.username,
        commenterId: user?.userId,
      });
      console.log("Comment submitted successfully:", response.data);
      setComment("");
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const toggleComments = () => {
    setCommentsOpen(!commentsOpen);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: { xs: 2, sm: 4 }, marginTop: 4 }}>
        <Stack gap={1} direction="row" sx={{ flexWrap: "wrap" }}>
          {tags.slice(0, 3).map((tag, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: "#DCDCDC",
                color: "black",
                p: 0.5,
                borderRadius: 1,
                fontSize: "12px",
              }}
            >
              {tag}
            </Box>
          ))}
        </Stack>
        <Typography variant="body1" gutterBottom mt={2} sx={{fontWeight:"700",fontSize:{xs:"16px",sm:"24px"}}}>
          {title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          By {writer}
        </Typography>
        <Typography variant="body2" paragraph sx={{fontSize:"16px"}}>
          {content}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Likes: {likes}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Button
              variant="contained"
              onClick={() => {
                PostLike(receivedId);
              }}
            >
              Like
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="comment"
              multiline
              fullWidth
              variant="outlined"
              value={comment}
              rows={2}
              onChange={handleCommentChange}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => {
                PostComment(receivedId);
              }}
            >
              Post Comments
            </Button>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ marginTop: 2 }}
        >
          <Typography variant="h6">Comments</Typography>
          <IconButton onClick={toggleComments}>
            {commentsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Grid>
        <Collapse in={commentsOpen}>
          <List>
            {comments.map((comment, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={comment.comment}
                  secondary={`By ${comment.commenterName}`}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Paper>
    </Container>
  );
};

export default Read;
