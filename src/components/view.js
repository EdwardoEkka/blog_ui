import React, { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  Button,
  Paper,
  Container,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useUserContext } from "../userContext";
import { getToken } from "./tokenService";

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

const View = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [blogs, setBlogs] = useState([]);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [pub, setPub] = useState(null);
  const { user, updateUser } = useUserContext();
  const [show, setShow] = useState(false);
  const [isopen, setIsopen] = useState(true);
  const [showTags, setShowTags] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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

  const getBlogsForDate = () => {
    if (selectedDate && blogs.length > 0) {
      const selectedDateString = selectedDate.toLocaleDateString("en-GB");
      const filteredBlogs = blogs.filter((blog) => {
        return Date_extract(blog.date) === selectedDateString;
      });
      return filteredBlogs;
    }
    return [];
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const paginatedData = blogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const dataToSend = { blog_id: id };

  const fetchBlogs = async () => {
    try {
      const response = await axios.post("http://localhost:5000/getBlogs", {
        id: user.userId,
      });
      console.log("Blogs fetched successfully:", response.data);
      setBlogs(response.data);
    } catch (error) {
      setBlogs([]);
      console.error("Error getting blogs:", error);
    }
  };

  useEffect(() => {
    console.log(user);
    fetchBlogs();
  }, []);

  const Date_extract = (date) => {
    const dateObject = new Date(date);
    const day = dateObject.getUTCDate();
    const month = dateObject.getUTCMonth() + 1;
    const year = dateObject.getUTCFullYear();
    const formattedDate = `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
    return formattedDate;
  };

  function formatDate(isoDate) {
    const date = new Date(isoDate);

    // Formatting the date
    const options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString(undefined, options);

    // Formatting the time
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

    return `${formattedDate}, ${formattedTime}`;
  }

  const imdobile = windowDimensions.width < 768;

  // For the left sidebar
  const showLeftSidebar = imdobile ? isopen : true;

  // For the right content area
  const showRightContent = imdobile ? !isopen : true;

  const handleSubmit = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/deleteTheBlog/${id}`
      );
      if (response.status === 200) {
        console.log(response.data);
        setTitle("");
        setBody("");
        setId("");
        fetchBlogs();
        setShow(false);
      } else {
        throw new Error("Failed to delete blog");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetPublic = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/publicUpdate/${id}`,
        { public: pub }
      );
      if (response.status === 200) {
        console.log("Public updated successfully");
        setPub(response.data.public);
        fetchBlogs();
      } else {
        throw new Error("Failed to update public");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    handleClose();
    navigate("/update", { state: dataToSend });
  };

  const handleDelete = () => {
    handleClose();
    handleSubmit();
  };

  const toggleTags = () => {
    setShowTags(!showTags);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {user.userId !== "" ? (
          <Stack direction={{ xs: "column", md: "row" }} sx={{ padding: "0" }}>
            <Stack
              sx={{
                height: { md: "100vh", xs: "100vh" },
                minWidth: { md: "300px", xs: "100vw" },
                maxWidth: { md: "300px" },
                backgroundColor: "white",
                alignItems: "center",
                overflowY: "auto",
                overflowX: "hidden",
                position: "sticky",
                left: "0",
                top: "0",
                display: showLeftSidebar ? "flex" : "none",
              }}
            >
              <Stack>
                <Typography variant="h6">Hello {user.username}</Typography>
              </Stack>
              {blogs.length !== 0 ? (
                <Stack
                  sx={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Typography
                      style={{
                        padding: "5px",
                        cursor: "pointer",
                        textDecoration: show ? "none" : "underline",
                      }}
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      All Blog
                    </Typography>
                    <Typography
                      style={{
                        padding: "5px",
                        cursor: "pointer",
                        textDecoration: show ? "underline" : "none",
                      }}
                      onClick={() => {
                        setShow(true);
                      }}
                    >
                      Search Blog
                    </Typography>
                  </Stack>
                  {show ? (
                    <Stack sx={{ p: "10px", width: "95%" }}>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd-MM-yyyy"
                      />
                      <Typography variant="h6">
                        Blog for{" "}
                        {selectedDate
                          ? selectedDate.toLocaleDateString("en-GB")
                          : ""}
                      </Typography>
                      {getBlogsForDate().length > 0 ? (
                        getBlogsForDate().map((blog, index) => (
                          <Stack
                            key={index}
                            sx={{
                              border: "1px solid black",
                              width: "100%",
                              cursor: "pointer",
                              marginTop: "5px",
                              borderRadius: "10px",
                              flexGrow: 1,
                            }}
                            onClick={() => {
                              setId(blog._id);
                              setBody(blog.body);
                              setTitle(blog.title);
                              setTags(blog.tags);
                              setIsopen(!isopen);
                              setPub(blog.public);
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                paddingLeft: "5px",
                                paddingRight: "5px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {blog.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ paddingLeft: "5px", paddingRight: "5px" }}
                            >
                              {formatDate(blog.date)}
                            </Typography>
                          </Stack>
                        ))
                      ) : (
                        <div>
                          <p>No Blogs Found for the Selected Date</p>
                        </div>
                      )}
                    </Stack>
                  ) : (
                    <Stack sx={{ p: "10px", width: "95%" }}>
                      <Typography variant="h6">All Blogs</Typography>
                      {paginatedData.map((item, index) => (
                        <Stack
                          key={index}
                          sx={{
                            border: "1px solid black",
                            width: "100%",
                            cursor: "pointer",
                            marginTop: "5px",
                            borderRadius: "10px",
                          }}
                          onClick={() => {
                            setId(item._id);
                            setBody(item.body);
                            setTitle(item.title);
                            setTags(item.tags);
                            setPub(item.public);
                            setIsopen(!isopen);
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              paddingLeft: "5px",
                              paddingRight: "5px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ paddingLeft: "5px", paddingRight: "5px" }}
                          >
                            {formatDate(item.date)}
                          </Typography>
                        </Stack>
                      ))}
                      <Stack
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          p: "10px",
                          gap: "20px",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          disabled={page === 1}
                          onClick={() => handleChangePage(page - 1)}
                          variant="contained"
                          sx={{ width: "100px" }}
                        >
                          Previous
                        </Button>
                        <Button
                          disabled={page * itemsPerPage >= blogs.length}
                          onClick={() => handleChangePage(page + 1)}
                          variant="contained"
                          sx={{ width: "100px" }}
                        >
                          Next
                        </Button>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              ) : (
                <Stack
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate("/write");
                  }}
                >
                  Click here to write blogs
                </Stack>
              )}
            </Stack>

            <Stack
              sx={{
                flexGrow: 1,
                minHeight: { md: "100vh", xs: "100vh" },
                width: { md: `100%`, xs: "100%" },
                backgroundColor: "#E7DECC",
                position: "sticky",
                top: "0",
                display: showRightContent ? "flex" : "none",
              }}
            >
              <Stack
                sx={{
                  display: { xs: "block", md: "none" },
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
                onClick={() => {
                  setIsopen(!isopen);
                }}
              >
                <Stack style={{ display: "flex", alignItems: "center" }}>
                  <Typography>Blogs</Typography>
                  <SlArrowDown />
                </Stack>
              </Stack>
              {id ? (
                <Stack sx={{ paddingLeft: "20px", paddingRight: "20px" }}>
                  <Container>
                    <Paper
                      elevation={3}
                      sx={{ padding: 4, marginTop: 4, position: "relative" }}
                    >
                      <Stack
                        onClick={handleMenuClick}
                        position="absolute"
                        sx={{ right: "0", padding: "5px" }}
                      >
                        <FaEllipsisV />
                      </Stack>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem>
                          {" "}
                          {pub ? (
                            <img
                              style={{ width: "40px", height: "40px" }}
                              src="./icons/public.png"
                              alt="public"
                              onClick={handleSetPublic}
                            />
                          ) : (
                            <img
                              style={{ width: "40px", height: "40px" }}
                              src="./icons/private.png"
                              alt="private"
                              onClick={handleSetPublic}
                            />
                          )}
                        </MenuItem>
                        <MenuItem onClick={handleUpdate}>Update</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                      </Menu>
                      <Typography variant="h4" gutterBottom>
                        {title}
                      </Typography>
                      <Button variant="contained" onClick={toggleTags}>
                        {showTags ? "Hide Tags" : "Show Tags"}
                      </Button>
                      {showTags && (
                        <Stack
                          gap={2}
                          mt={2}
                          direction="row"
                          sx={{ flexWrap: "wrap" }}
                        >
                          {tags.map((tag, index) => (
                            <Chip key={index} label={tag} color="primary" />
                          ))}
                        </Stack>
                      )}
                      <Typography variant="body1" paragraph mt={2}>
                        {body}
                      </Typography>
                    </Paper>
                  </Container>
                </Stack>
              ) : (
                ""
              )}
            </Stack>
          </Stack>
        ) : (
          <Container maxWidth={false}></Container>
        )}
      </div>
    </ThemeProvider>
  );
};

export default View;
