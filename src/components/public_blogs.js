import {
  Stack,
  Typography,
  Card,
  CardMedia,
  Container,
  Box,
  Button,
  useMediaQuery,
  Chip,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "./tokenService";
import { useUserContext } from "../userContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      tb: 768,
      md: 960,
      lg: 1200,
      xl: 1536,
    },
  },
});

const Public_blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const { user, updateUser } = useUserContext();
  const [latest, setLatest] = useState(null);
  const isXs = useMediaQuery(theme.breakpoints.down("sm")); // xs to sm (1 blog per page)
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md")); // sm to md (2 blogs per page)
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const apiUrl = process.env.REACT_APP_API_URL;

  let blogsPerPage;
  if (isXs) {
    blogsPerPage = 1;
  } else if (isSm) {
    blogsPerPage = 2;
  } else if (isMdUp) {
    blogsPerPage = 3;
  }

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

  // Fetch blogs from the server
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${apiUrl}/getPubBlogs`);
        console.log("Blogs fetched successfully:", response.data);
        setBlogs(response.data.slice(1));
        setLatest(response.data[0]);
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
              Authorization:
                "eVdUHdmsN1kGXmocqmyGx4Yh2uiH2SSwzcDNCOKirUvUuNtIOa886BZR",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch picture");
        }
        const data = await response.json();
        const imageUrl = data.photos[0].src.large;
        setBlogs((prevBlogs) => {
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
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString(undefined, options);
    return `${formattedDate}`;
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(blogs.length / blogsPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const displayedBlogs = blogs.slice(
    currentPage * blogsPerPage,
    currentPage * blogsPerPage + blogsPerPage
  );

  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          marginTop: 4,
          marginBottom:4
        }}
        maxWidth={false}
      >
        <Stack
          sx={{
            width: { md: "50%", xs: "100%" },
            pr: { md: 2 },
            height: { md: "600px", xs: "300px" },
          }}
        >
          {latest && (
            <Card
              sx={{
                width: "100%",
                mb: 2,
                cursor: "pointer",
                height: { md: "100%", xs: "100%" },
                position: "relative",
                overflow: "hidden",
              }}
              onClick={() => {
                navigate("/read", { state: { blog_id: latest._id } });
              }}
            >
              <CardMedia
                component="img"
                image={latest.imageUrl || "/img.png"}
                alt={latest.title}
                sx={{ height: { md: "100%", xs: "100%" }, objectFit: "cover" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  p: 2,
                  boxSizing: "border-box",
                }}
              >
                <Stack direction="row" gap={2}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {latest.name}
                  </Typography>
                  <Typography variant="body2" color="white">
                    {formatDate(latest.date)}
                  </Typography>
                </Stack>
                <Typography
                  variant="h6"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%",
                  }}
                  gutterBottom
                >
                  {latest.title}
                </Typography>
                <Stack gap={1} direction="row" sx={{ flexWrap: "wrap" }}>
                  {latest.tags.slice(0, 3).map((tag, index) => (
                    <Box
                      key={index}
                      sx={{
                        bgcolor: "#787878",
                        color: "white",
                        p: 0.5,
                        borderRadius: 1,
                        fontSize: "12px",
                      }}
                    >
                      {tag}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Card>
          )}
        </Stack>
        <Stack sx={{ width: { md: "50%", xs: "100%" } }}>
          <Stack
            flexWrap={{ md: "wrap" }}
            gap={2}
            justifyContent="center"
            alignItems="flex-start"
            sx={{ height: { md: "auto", xs: "auto" }, flexDirection: "row" }}
          >
            {displayedBlogs.map((blog, index) => (
              <Card
                key={index}
                sx={{
                  width: "100%",
                  maxWidth: "100%",
                  mb: 2,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                }}
                onClick={() => {
                  navigate("/read", { state: { blog_id: blog._id } });
                }}
              >
                <Stack sx={{ width: { xs: "100%", md: "40%" } }}>
                  <CardMedia
                    component="img"
                    image={blog.imageUrl || "/img.png"}
                    alt={blog.title}
                    sx={{
                      height: 150,
                      objectFit: "cover",
                    }}
                  />
                </Stack>
                <Box sx={{ p: 1.6, width: { xs: "100%", md: "60%" } }}>
                  <Stack direction="row" gap={2}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {blog.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(blog.date)}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h6"
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%",
                    }}
                    gutterBottom
                  >
                    {blog.title}
                  </Typography>

                  <Stack gap={1} direction="row" sx={{ flexWrap: "wrap" }}>
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <Box
                        key={index}
                        sx={{
                          bgcolor: "#E8E8E8",
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
                </Box>
              </Card>
            ))}
          </Stack>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNextPage}
              disabled={
                currentPage >= Math.ceil(blogs.length / blogsPerPage) - 1
              }
            >
              Next
            </Button>
          </Box>
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default Public_blogs;
