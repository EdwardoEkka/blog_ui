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
      tb:768,
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen width is less than or equal to 768px
  const blogsPerPage = isMobile ? 1 : 2;

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

  // Fetch blogs from the server
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getPubBlogs");
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
        }}
        maxWidth={false}
      >
        <Stack
          sx={{
            width: { md: "60%", xs: "100%" },
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
                <Typography
                  variant="h6"
                  gutterBottom

                >
                  {latest.title}
                </Typography>
                <Stack gap={2} mt={1} direction="row" sx={{ flexWrap: "wrap" }}>
                  {latest.tags.slice(0, 3).map((tag, index) => (
                    <Chip key={index} label={tag} color="primary" />
                  ))}
                </Stack>
                <Typography variant="body2" color="inherit">
                  {formatDate(latest.date)}
                </Typography>
                <Typography
                  variant="body2"
                  color="inherit"
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  by {latest.name}
                </Typography>
              </Box>
            </Card>
          )}
        </Stack>
        <Stack sx={{ width: { md: "40%", xs: "100%" } }}>
          <Typography variant="h6" sx={{textAlign:"center"}}>
            Public Blogs
          </Typography>
          <Stack
            flexWrap={{md:"wrap"}}
            gap={2}
            justifyContent="center"
            alignItems="flex-start"
            sx={{ height: { md: "auto", xs: "auto" },flexDirection:"row" }}
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
                <Stack sx={{  width: { xs: "100%", md: "40%" },}}>

                <CardMedia
                  component="img"
                  image={blog.imageUrl || "/img.png"}
                  alt={blog.title}
                  height={200}
                  sx={{
                    objectFit: "cover",
                  }}
                />
                </Stack>
                <Box sx={{ p: 2 ,width: { xs: "100%", md: "60%" },}}>
                  <Stack direction="row" gap={2}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ display: "flex", justifyContent: "flex-end",fontSize:"16px",fontWeight:"bold"}}
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
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width:"100%"
                    }}
                    gutterBottom
                  >
                    {blog.title}
                  </Typography>
                  <Stack
                    gap={1}
                    direction="row"
                    sx={{ flexWrap: "wrap" }}
                  >
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <Box key={index} sx={{ bgcolor: 'primary.main', color: 'white', p: 0.5, borderRadius: 1,fontSize:"12px"}}>
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
