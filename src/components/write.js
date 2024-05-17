import { Stack, Typography, TextField, Button, Container } from "@mui/material";
import React, { useState, useEffect } from "react";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";
import Slide from "@mui/material/Slide";
import Edit from "./edit";
// import Chip from "@mui/material/Chip";
import { useUserContext } from "../userContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { getToken } from "./tokenService";
import TagsInput from "./tags";

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

const Write = () => {
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
  const id = user.userId;
  const name = user.username;
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState("#000000");
  const [fntFamily, setFntFamily] = useState("Arial");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const availableTags = [
    "React",
    "JavaScript",
    "Material-UI",
    "CSS",
    "HTML",
    "Node.js",
    "Express",
    "MongoDB",
  ];

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

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/write", {
        name: name,
        userId: id,
        title: title,
        body: content,
        date: date,
        tags: tags
      });
      console.log("Post submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

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

  return (
    <ThemeProvider theme={theme}>
      <Stack>
        {user.userId !== "" ? (
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
                    <Typography variant="p">Good {timeOfDay}</Typography>
                    <Typography variant="p">
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
                    <Stack sx={{ padding: "10px" }}>
                      <Typography variant="p">{quote}</Typography>
                      <Typography variant="p">- {author}</Typography>
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
                <Typography variant="p">Good {timeOfDay}</Typography>
                <Typography variant="p">{time.toLocaleTimeString()}</Typography>
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
                <Stack sx={{ padding: "10px" }}>
                  <Typography variant="p">{quote}</Typography>
                  <Typography variant="p">- {author}</Typography>
                </Stack>
              </Stack>
            )}

            <Stack
              sx={{
                height: "auto",
                width: "100vw",
                backgroundColor: "#E7DECC",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Stack
                sx={{ display: { xs: "block", md: "none" } }}
                onClick={() => {
                  setIsopen(!isopen);
                }}
              >
                {isopen ? <SlArrowUp /> : <SlArrowDown />}
              </Stack>
              <Stack direction="column" alignItems="center" spacing={2}>
                <Typography variant="p">Write your blog here</Typography>
                <Button
                  variant="contained"
                  onClick={() => {setIsMenuOpen(!isMenuOpen)}}
                  sx={{ marginBottom: 10 }}
                >
                  {isMenuOpen ? "Close Menu" : "Open Tools"}
                </Button>

                {isMenuOpen && (
                  <Edit
                    fFmaily={handleFontFamilyChange}
                    fSize={handleFontSizeChange}
                    fColor={handleFontColorChange}
                  />
                )}
                <Container >
                  <TagsInput
                    tags={tags}
                    setTags={setTags}
                    availableTags={availableTags}
                  />
                </Container>
                <TextField
                  id="blog-title"
                  multiline
                  variant="outlined"
                  value={title}
                  rows={2}
                  onChange={handletitleChange}
                  sx={{
                    width: { md: "60vw", xs: "80vw" },
                    backgroundColor: "white",
                  }}
                  InputProps={{
                    style: {
                      color: fontColor,
                      fontSize: `${fontSize}px`,
                      fontFamily: fntFamily,
                    },
                  }}
                />
                <TextField
                  id="blog-content"
                  multiline
                  variant="outlined"
                  value={content}
                  onChange={handleContentChange}
                  sx={{
                    width: { md: "60vw", xs: "80vw" },
                    backgroundColor: "white",
                    minHeight: "70vh",
                  }}
                  InputProps={{
                    style: {
                      color: fontColor,
                      fontSize: `${fontSize}px`,
                      fontFamily: fntFamily,
                    },
                  }}
                />
              </Stack>
              <Button
                variant="contained"
                color="primary"
                sx={{ m: "20px" }}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Stack sx={{ alignItems: "center", justifyContent: "center" }}>
            Please Login
          </Stack>
        )}
      </Stack>
    </ThemeProvider>
  );
};

export default Write;
