import {
  Stack,
  Typography,
  TextField,
  Button,
  Container,
  MenuItem,
  Menu,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";
import Slide from "@mui/material/Slide";
import { useLocation } from "react-router-dom";
import Edit from "./edit";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getToken } from "./tokenService";
import { useUserContext } from "../userContext";
import TagsInput from "./tags";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1200,
      xl: 1536,
    },
  },
});

const Update = (props) => {
  const [date, setDate] = useState(new Date());
  const [timeOfDay, setTimeOfDay] = useState("");
  const [picture, setPicture] = useState("");
  const [query, setQuery] = useState("");
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [time, setTime] = useState(new Date());
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [isopen, setIsopen] = useState(false);
  const { user, updateUser } = useUserContext();
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState("#000000");
  const [fntFamily, setFntFamily] = useState("Arial");
  const availableTags = [
    "Web Development",
    "Programming",
    "Tech News",
    "Tutorials",
    "Opinion",
    "Reviews",
    "Productivity",
    "Lifestyle",
    "Career",
    "Education",
    "Design",
    "SEO",
    "Marketing",
    "Data Science",
    "AI",
    "Machine Learning",
  ];

  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setisMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setisMenuOpen(false);
  };

  const fetchUserDetails = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get(`${apiUrl}/user-details`, {
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

  const location = useLocation();
  const recievedId = location.state?.blog_id;

  useEffect(() => {
    async function fetchBlogData() {
      try {
        const response = await axios.get(`${apiUrl}/getTheBlog/${recievedId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch blog data");
        }
        const data = response.data;
        setTitle(data.title);
        setContent(data.body);
        setTags(data.tags);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBlogData();
  }, [recievedId]);

  const handleFontColorChange = (newFontColor) => {
    setFontColor(newFontColor);
  };

  const handleFontSizeChange = (newFontSize) => {
    setFontSize(newFontSize);
  };

  const handleFontFamilyChange = (newFontFamily) => {
    setFntFamily(newFontFamily);
    console.log(fntFamily);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };
  const handletitleChange = (event) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    async function fetchRandomQuote() {
      try {
        const response = await fetch("https://api.quotable.io/random");
        if (!response.ok) {
          throw new Error("Failed to fetch quote");
        }
        const data = await response.json();
        setQuote(data.content);
        setAuthor(data.author);
      } catch (error) {
        console.error(error);
      }
    }

    fetchRandomQuote();
  }, []);

  useEffect(() => {
    async function fetchRandomPicture() {
      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${query}&per_page=1&page=${
            Math.floor(Math.random() * 100) + 1
          }`,
          {
            headers: {
              Authorization:
                "eVdUHdmsN1kGXmocqmyGx4Yh2uiH2SSwzcDNCOKirUvUuNtIOa886BZR",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch picture");
        }
        const data = await response.json();
        if (data.photos.length > 0) {
          setPicture(data.photos[0].src.large);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchRandomPicture();
  }, [query]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const currentTime = date.getHours();

    if (currentTime >= 5 && currentTime < 12) {
      setTimeOfDay("Morning");
      setQuery("morning");
    } else if (currentTime >= 12 && currentTime < 17) {
      setTimeOfDay("Afternoon");
      setQuery("afternoon");
    } else if (currentTime >= 17 && currentTime < 21) {
      setTimeOfDay("Evening");
      setQuery("evening");
    } else {
      setTimeOfDay("Night");
      setQuery("night");
    }
  }, [date]);

  const handleSubmit = async () => {
    if (!title || !content || tags.length === 0) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/updateTheBlog/${recievedId}`,
        {
          title: title,
          body: content,
          tags: tags,
        }
      );
      if (response.status === 200) {
        toast.success("Blog updated successfully!");
        console.log("Blog updated successfully");
      } else {
        throw new Error("Failed to update blog");
      }
    } catch (error) {
      toast.error("Error updating blog.");
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack>
        {user.userId === "" ? (
          <Stack>Please Login</Stack>
        ) : (
          <Stack direction={{ xs: "column", md: "row" }}>
            {windowDimensions.width <= 768 ? (
              isopen ? (
                <Slide direction="down" in={isopen} mountOnEnter unmountOnExit>
                  <Stack
                    sx={{
                      height: { xs: "auto", md: "100vh" },
                      width: { xs: "100vw", md: "30vw" },
                      backgroundColor: "#FFADA",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        marginTop: "20px",
                        fontSize: "24px",
                        fontWeight: "700",
                      }}
                    >
                      Good {timeOfDay}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        marginTop: "20px",
                        fontSize: "20px",
                        fontWeight: "400",
                      }}
                    >
                      {time.toLocaleTimeString()}
                    </Typography>
                    {picture && (
                      <img
                        src={picture}
                        alt="Time of Day"
                        style={{
                          width: "60%",
                          borderRadius: "20px",
                          marginBottom: "20px",
                        }}
                      />
                    )}
                    <Stack
                      sx={{ padding: "10px", justifyContent: "center" }}
                      direction="column"
                    >
                      <Typography variant="body2" sx={{ fontSize: "16px" }}>
                        {quote}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "16px", fontWeight: "700" }}
                      >
                        - {author}
                      </Typography>
                    </Stack>
                  </Stack>
                </Slide>
              ) : null
            ) : (
              <Stack
                sx={{
                  height: { xs: "auto", md: "100vh" },
                  width: { xs: "100vw", md: "30vw" },
                  backgroundColor: "#FFADA",
                  alignItems: "center",
                  position: "sticky",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  zIndex: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    marginTop: "20px",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                >
                  Good {timeOfDay}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    marginTop: "20px",
                    fontSize: "20px",
                    fontWeight: "400",
                  }}
                >
                  {time.toLocaleTimeString()}
                </Typography>
                {picture && (
                  <img
                    src={picture}
                    alt="Time of Day"
                    style={{
                      width: "60%",
                      borderRadius: "20px",
                      marginBottom: "20px",
                    }}
                  />
                )}
                <Stack
                  sx={{ padding: "10px", justifyContent: "center" }}
                  direction="column"
                >
                  <Typography variant="body2" sx={{ fontSize: "16px" }}>
                    {quote}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "16px", fontWeight: "700" }}
                  >
                    - {author}
                  </Typography>
                </Stack>
              </Stack>
            )}

            <Stack
              sx={{
                height: "100vh",
                width: "100vw",
                backgroundColor: "#E7DECC",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Stack
                sx={{ display: { xs: "block", md: "none" }}}
                onClick={() => {
                  setIsopen(!isopen);
                }}
              >
                {isopen ? <SlArrowUp /> : <SlArrowDown />}
              </Stack>
              <Stack
                direction="column"
                alignItems="center"
                spacing={2}
                sx={{
                  marginTop: { xs: "10px", sm: "20px" },
                  width: "100%",
                  paddingX: "16px",
                }}
              >
                <Container>
                  <TagsInput
                    tags={tags}
                    setTags={setTags}
                    availableTags={availableTags}
                  />
                </Container>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={title}
                  onChange={handletitleChange}
                />
                <Stack sx={{marginBottom:"20px"}}>
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  placeholder="Enter content here"
                  style={{
                    marginBottom: "20px",
                    width: "100%",
                    fontSize: `${fontSize}px`,
                    color: fontColor,
                    fontFamily: fntFamily,
                  }}
                />
                </Stack>
              </Stack>
              <Button
                variant="contained"
                color="primary"
                sx={{}}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        )}
        <Toaster />
      </Stack>
    </ThemeProvider>
  );
};

export default Update;
