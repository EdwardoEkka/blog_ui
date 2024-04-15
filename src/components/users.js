import React, { useState, useEffect } from "react";
import axios from "axios";
import Chat from "./data";
import { useUser } from "./userContext";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState("");
  const [name, setName] = useState("");
  const [chat, setChat] = useState(false);
  const { username, objectId } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get_users");
        setUsers(response.data.filter((user) => user._id !== objectId));
        setLoading(false);
      } catch (error) {
        console.error("There was a problem fetching the users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      {chat ? (
        <div>
          <Chat person={person} name={name} />
        </div>
      ):(
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul style={{}}>
              {users.map((user) => (
                <li key={user.id}>
                  {user.name}
                  <span>
                    {" "}
                    <button
                      onClick={() => {
                        setPerson(user._id);
                        setName(user.name);
                        setChat(!chat);
                      }}
                    >
                      Chat
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) 
      }
    </div>
  );
};

export default UserList;
