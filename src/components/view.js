import React, { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  Button,
  Paper,
  Container,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { SlArrowDown } from "react-icons/sl";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useUserContext } from "../userContext";
import { getToken } from "./tokenService";
import PleaseLogin from "./l_t_c";
import toast, { Toaster } from "react-hot-toast";

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
  const apiUrl = process.env.REACT_APP_API_URL;

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
      const response = await axios.post(`${apiUrl}/getBlogs`, {
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
      const response = await axios.delete(`${apiUrl}/deleteTheBlog/${id}`);
      if (response.status === 200) {
        console.log(response.data);
        setTitle("");
        setBody("");
        setId("");
        fetchBlogs();
        setShow(false);
        toast.success("Blog deleted successfully");
      } else {
        throw new Error("Failed to delete blog");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleSetPublic = async () => {
    try {
      const response = await axios.post(`${apiUrl}/publicUpdate/${id}`, {
        public: pub,
      });
      if (response.status === 200) {
        console.log("Public updated successfully");
        setPub(response.data.public);
        fetchBlogs();
        if (response.data.public === true) {
          toast.success("Blog is public now.");
        } else {
          toast.success("Blog is private now.");
        }
      } else {
        throw new Error("Failed to update public");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
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
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "24px",
                    fontWeight: "700",
                    marginTop: { xs: "10px", sm: "20px" },
                  }}
                >
                  Hello {user.username}
                </Typography>
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
                      marginTop: { xs: "10px", sm: "20px" },
                    }}
                  >
                    <Typography
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        backgroundColor: show ? "transparent" : "#e0e0e0", // Change to a selected color you prefer
                        border: show
                          ? "1px solid transparent"
                          : "1px solid #000", // Change to the border you prefer
                        borderRadius: "5px",
                      }}
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      All Blog
                    </Typography>
                    <Typography
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        backgroundColor: show ? "#e0e0e0" : "transparent", // Change to a selected color you prefer
                        border: show
                          ? "1px solid #000"
                          : "1px solid transparent", // Change to the border you prefer
                        borderRadius: "5px",
                      }}
                      onClick={() => {
                        setShow(true);
                      }}
                    >
                      Search Blog
                    </Typography>
                  </Stack>
                  {show ? (
                    <Stack
                      sx={{
                        p: "10px",
                        width: "95%",
                        marginTop: { sm: "20px", xs: "10px" },
                      }}
                    >
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd-MM-yyyy"
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          marginTop: { xs: "10px", sm: "20px" },
                          fontSize: "16px",
                          fontWeight: "400",
                        }}
                      >
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
                              marginTop: "10px",
                              borderRadius: "10px",
                              flexGrow: 1,
                              "&:hover": {
                                backgroundColor: "grey",
                              },
                            }}
                            onClick={() => {
                              setId(blog._id);
                              setBody(blog.body);
                              setTitle(blog.title);
                              setTags(blog.tags);
                              setIsopen(!isopen);
                              setPub(blog.public);
                              console.log(blog.title);
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
                        <Stack>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "16px",
                              fontWeight: "700",
                              marginTop: "10px",
                            }}
                          >
                            No Blogs Found for the Selected Date
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  ) : (
                    <Stack
                      sx={{
                        p: "10px",
                        width: "95%",
                        marginTop: { xs: "10px", sm: "20px" },
                      }}
                    >
                      {paginatedData.map((item, index) => (
                        <Stack
                          key={index}
                          sx={{
                            border: "1px solid black",
                            width: "100%",
                            cursor: "pointer",
                            marginTop: "10px",
                            borderRadius: "10px",
                            "&:hover": {
                              backgroundColor: "grey",
                            },
                          }}
                          onClick={() => {
                            setId(item._id);
                            setBody(item.body);
                            setTitle(item.title);
                            setTags(item.tags);
                            setPub(item.public);
                            setIsopen(!isopen);
                            console.log(item.body);
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
                <Button
                  sx={{ cursor: "pointer", marginTop: "20px" }}
                  variant="contained"
                  onClick={() => {
                    navigate("/write");
                  }}
                >
                  Click here to write blogs
                </Button>
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
                <Stack
                  sx={{
                    paddingLeft: { xs: "2px", sm: "20px" },
                    paddingRight: { xs: "2px", sm: "20px" },
                  }}
                >
                  <Container disableGutters sx={{height:"100vh"}}>
                    <Paper
                      elevation={3}
                      sx={{
                        padding: { xs: 2, sm: 4 },
                        marginTop: 4,
                        position: "relative",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={handleMenuClick}
                        sx={{ marginRight: "5px", marginTop: "3px" }}
                      >
                        Edit Options
                      </Button>
                      <Button
                        variant="contained"
                        onClick={toggleTags}
                        sx={{ marginTop: "3px" }}
                      >
                        {showTags ? "Hide Tags" : "Show Tags"}
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem>
                          {" "}
                          {pub ? (
                            <Typography
                              variant="body2"
                              onClick={handleSetPublic}
                            >
                              Make Private
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              onClick={handleSetPublic}
                            >
                              Make Public
                            </Typography>
                          )}
                        </MenuItem>
                        <MenuItem onClick={handleUpdate}>Update</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                      </Menu>
                      {showTags && (
                        <Stack
                          gap={2}
                          mt={2}
                          direction="row"
                          sx={{ flexWrap: "wrap" }}
                        >
                          {tags.map((tag, index) => (
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
                      )}
                      <Typography
                        variant="h5"
                        sx={{
                          fontSize: {
                            xs: "1.5rem", // font size for extra small screens
                            sm: "1.75rem", // font size for small screens
                            md: "2rem", // font size for medium screens
                            lg: "2.5rem", // font size for large screens
                            xl: "3rem", // font size for extra large screens
                          },
                          marginTop:"20px"
                        }}
                      >
                        {title}
                      </Typography>
                      <Box
                        dangerouslySetInnerHTML={{ __html: body }}
                        style={{ margin: 0 }}
                      />
                    </Paper>
                  </Container>
                </Stack>
              ) : (
                ""
              )}
            </Stack>
          </Stack>
        ) : (
          <PleaseLogin word={"read"} />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default View;
